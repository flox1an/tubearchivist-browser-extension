/*
Loaded into popup index.html
*/

'use strict';

let browserType = getBrowser();
const autosaveDelayMs = 500;
const connectionToggleLockMs = 250;
const visibleDisplay = 'block';
const hiddenDisplay = 'none';

const connectionCard = document.getElementById('connection-card');
const taUrlLink = document.getElementById('ta-url');
const extensionVersion = document.getElementById('extension-version');
const errorOut = document.getElementById('error-out');
const fullUrlInput = document.getElementById('full-url');
const apiKeyInput = document.getElementById('api-key');
const connectionState = document.getElementById('connection-state');
const connectionToggle = document.getElementById('connection-toggle');
const connectionSummaryUrl = document.getElementById('connection-summary-url');
const connectionSummaryMeta = document.getElementById('connection-summary-meta');
const saveState = document.getElementById('save-state');
const cookieStatus = document.getElementById('sendCookiesStatus');
const cookieResponseTextArea = document.getElementById('cookieLinesResponse');
const showCookiesButton = document.getElementById('showCookies');
const continuousSyncInput = document.getElementById('continuous-sync');
const autostartInput = document.getElementById('autostart');
const watchAutoQueueInput = document.getElementById('watch-auto-queue');
const likeAutoQueueInput = document.getElementById('like-auto-queue');

let autosaveTimeout = null;
let connectionRequestToken = 0;
let connectionCollapsed = false;
let connectionToggleLocked = false;

// boilerplate to dedect browser type api
function getBrowser() {
  if (typeof chrome !== 'undefined') {
    if (typeof browser !== 'undefined') {
      return browser;
    } else {
      return chrome;
    }
  } else {
    console.log('failed to detect browser');
    throw 'browser detection error';
  }
}

function storageGet(keys) {
  return new Promise(resolve => {
    browserType.storage.local.get(keys, result => resolve(result));
  });
}

function storageSet(values) {
  return new Promise((resolve, reject) => {
    browserType.storage.local.set(values, () => {
      if (browserType.runtime.lastError) {
        reject(browserType.runtime.lastError);
        return;
      }
      resolve();
    });
  });
}

function setExtensionVersion() {
  extensionVersion.textContent = `v${browserType.runtime.getManifest().version}`;
}

async function sendMessage(message) {
  let { success, value } = await browserType.runtime.sendMessage(message);
  if (!success) {
    throw value;
  }
  return value;
}

function setError(message) {
  errorOut.style.display = visibleDisplay;
  errorOut.textContent = message;
}

function clearError() {
  errorOut.style.display = hiddenDisplay;
  errorOut.textContent = '';
}

function setHint(message, state = 'idle') {
  saveState.dataset.state = state;
  saveState.textContent = message;
}

function setBadge(element, message, state = 'idle') {
  element.dataset.state = state;
  element.textContent = message;
}

function setConnectionCollapsed(collapsed) {
  connectionCollapsed = collapsed;
  connectionCard.dataset.collapsed = collapsed ? 'true' : 'false';
}

function setConnectionStatus({ badge, badgeState, hint, hintState, error = null, collapsed = null }) {
  setBadge(connectionState, badge, badgeState);
  setHint(hint, hintState);
  if (error) {
    setError(error);
  } else {
    clearError();
  }
  if (collapsed !== null) {
    setConnectionCollapsed(collapsed);
  }
}

function updateConnectionSummary(access) {
  if (!access?.url) {
    connectionSummaryUrl.textContent = 'No connection configured';
    connectionSummaryMeta.textContent = 'Open this section to set your URL and API token.';
    return;
  }

  connectionSummaryUrl.textContent = formatAccessUrl(access);
  connectionSummaryMeta.textContent = access.apiKey
    ? ''
    : 'API token missing. Open this section to finish setup.';
}

function formatAccessUrl(access) {
  if (!access) return '#';

  if (
    (access.url.startsWith('http://') && access.port === '80') ||
    (access.url.startsWith('https://') && access.port === '443')
  ) {
    return access.url;
  }

  return `${access.url}:${access.port}`;
}

function addUrl(access) {
  taUrlLink.setAttribute('href', formatAccessUrl(access));
  updateConnectionSummary(access);
}

function buildAccessFromInputs() {
  let draftUrl = fullUrlInput.value.trim();
  let draftApiKey = apiKeyInput.value.trim();

  if (!draftUrl) {
    throw new Error('Enter your Tube Archivist URL.');
  }

  let normalizedUrl = draftUrl.includes('://') ? draftUrl : `http://${draftUrl}`;
  let parsed = new URL(normalizedUrl);

  return {
    popupFullUrl: draftUrl,
    popupApiKey: draftApiKey,
    access: {
      url: `${parsed.protocol}//${parsed.hostname}`,
      port: parsed.port || (parsed.protocol === 'https:' ? '443' : '80'),
      apiKey: draftApiKey,
    },
  };
}

async function persistDraftFields() {
  await storageSet({
    popupFullUrl: fullUrlInput.value.trim(),
    popupApiKey: apiKeyInput.value.trim(),
  });
}

async function commitConnectionSettings() {
  clearTimeout(autosaveTimeout);
  autosaveTimeout = null;

  try {
    await persistDraftFields();
    let payload = buildAccessFromInputs();
    setConnectionStatus({
      badge: 'Saved',
      badgeState: 'warning',
      hint: 'Saved automatically.',
      hintState: 'success',
    });
    await storageSet({
      access: payload.access,
      popupFullUrl: payload.popupFullUrl,
      popupApiKey: payload.popupApiKey,
    });
    addUrl(payload.access);
    updateConnectionSummary(payload.access);

    if (payload.access.url && payload.access.apiKey) {
      return await pingBackend();
    }

    setConnectionStatus({
      badge: 'Saved',
      badgeState: 'warning',
      hint: 'Saved automatically. Add an API token to test the connection.',
      hintState: 'warning',
      collapsed: false,
    });
    return true;
  } catch (error) {
    let message = error?.message ?? error;
    setConnectionStatus({
      badge: 'Needs attention',
      badgeState: 'error',
      hint: 'Draft saved locally. Enter a valid URL to apply changes.',
      hintState: 'warning',
      error: message,
      collapsed: false,
    });
    return false;
  }
}

function scheduleConnectionAutosave() {
  clearTimeout(autosaveTimeout);
  setConnectionStatus({
    badge: 'Saving...',
    badgeState: 'saving',
    hint: 'Saving changes...',
    hintState: 'idle',
    collapsed: false,
  });
  autosaveTimeout = window.setTimeout(() => {
    commitConnectionSettings();
  }, autosaveDelayMs);
}

document.getElementById('sendCookies').addEventListener('click', function () {
  sendCookie();
});

showCookiesButton.addEventListener('click', function () {
  showCookies();
});

connectionToggle.addEventListener('click', () => {
  if (connectionToggleLocked) return;

  connectionToggleLocked = true;
  setConnectionCollapsed(!connectionCollapsed);
  if (!connectionCollapsed) {
    fullUrlInput.focus();
  }
  window.setTimeout(() => {
    connectionToggleLocked = false;
  }, connectionToggleLockMs);
});

for (let input of [fullUrlInput, apiKeyInput]) {
  input.addEventListener('input', async () => {
    await persistDraftFields();
    scheduleConnectionAutosave();
  });

  input.addEventListener('blur', async () => {
    await commitConnectionSettings();
  });
}

function sendCookie() {
  console.log('popup send cookie');
  clearError();

  function handleResponse(message) {
    console.log('handle cookie response: ' + JSON.stringify(message));
    let validationMessage = message.validated_str || 'Synced';
    setBadge(cookieStatus, validationMessage, 'enabled');
  }

  function handleError(error) {
    console.log(`Error: ${error}`);
    setError(error);
  }

  let sending = sendMessage({ type: 'sendCookie' });
  sending.then(handleResponse, handleError);
}

function showCookies() {
  console.log('popup show cookies');
  function handleResponse(message) {
    cookieResponseTextArea.value = message.join('\n');
    cookieResponseTextArea.style.display = visibleDisplay;
  }
  function handleError(error) {
    console.log(`Error: ${error}`);
    setError(error);
  }

  if (cookieResponseTextArea.value) {
    cookieResponseTextArea.value = '';
    cookieResponseTextArea.style.display = hiddenDisplay;
    showCookiesButton.textContent = 'Show cookies';
  } else {
    let sending = sendMessage({ type: 'getCookieLines' });
    sending.then(handleResponse, handleError);
    showCookiesButton.textContent = 'Hide cookies';
  }
}

function storeCheckboxPreference(storageKey, checked) {
  let toStore = {
    [storageKey]: {
      checked,
    },
  };
  browserType.storage.local.set(toStore, function () {
    console.log('stored option: ' + JSON.stringify(toStore));
  });
}

function bindStoredCheckbox(input, storageKey, messageBuilder = null) {
  input.addEventListener('change', function () {
    let checked = input.checked;
    storeCheckboxPreference(storageKey, checked);
    if (messageBuilder) {
      sendMessage(messageBuilder(checked));
    }
  });
}

function hydrateStoredCheckbox(result, storageKey, input, missingMessage) {
  if (!result[storageKey] || result[storageKey].checked === false) {
    console.log(missingMessage);
    return;
  }
  console.log('set options: ' + JSON.stringify(result));
  input.checked = true;
}

bindStoredCheckbox(continuousSyncInput, 'continuousSync', checked => ({
  type: 'continuousSync',
  checked,
}));
bindStoredCheckbox(autostartInput, 'autostart');
bindStoredCheckbox(watchAutoQueueInput, 'watchAutoQueue');
bindStoredCheckbox(likeAutoQueueInput, 'likeAutoQueue');

// send ping message to TA backend
async function pingBackend() {
  setConnectionStatus({
    badge: 'Testing...',
    badgeState: 'saving',
    hint: 'Saved automatically. Testing connection...',
    hintState: 'idle',
  });

  let requestToken = ++connectionRequestToken;

  function handleResponse() {
    if (requestToken !== connectionRequestToken) return;
    console.log('connection validated');
    setConnectionStatus({
      badge: 'Connected',
      badgeState: 'connected',
      hint: 'Saved automatically. Connection verified.',
      hintState: 'success',
      collapsed: true,
    });
  }

  function handleError(error) {
    if (requestToken !== connectionRequestToken) return;
    console.log(`Verify got error: ${error}`);
    setConnectionStatus({
      badge: 'Connection failed',
      badgeState: 'error',
      hint: 'Saved automatically. Review your URL or API token, then test again.',
      hintState: 'warning',
      error,
      collapsed: false,
    });
  }

  console.log('ping TA server');
  let sending = sendMessage({ type: 'verify' });
  return sending.then(
    () => {
      handleResponse();
      return true;
    },
    error => {
      handleError(error);
      return false;
    }
  );
}

function setCookieState() {
  clearError();
  function handleResponse(message) {
    console.log(message);
    if (!message.cookie_enabled) {
      setBadge(cookieStatus, 'Disabled', 'disabled');
    } else {
      let validationMessage = message.validated_str || 'Ready';
      setBadge(cookieStatus, validationMessage, 'enabled');
    }
  }

  function handleError(error) {
    console.log(`Error: ${error}`);
    setError(error);
    setBadge(cookieStatus, 'Unavailable', 'error');
  }

  console.log('set cookie state');
  let sending = sendMessage({ type: 'cookieState' });
  sending.then(handleResponse, handleError);
}

// fill in form
document.addEventListener('DOMContentLoaded', async () => {
  setExtensionVersion();

  async function onGot(item) {
    let fullUrl = item.popupFullUrl;

    if (!fullUrl && item.access) {
      fullUrl = formatAccessUrl(item.access);
    }
    if (fullUrl != null) {
      fullUrlInput.value = fullUrl;
    }
    if (item.popupApiKey != null) {
      apiKeyInput.value = item.popupApiKey;
    } else if (item.access?.apiKey != null) {
      apiKeyInput.value = item.access.apiKey;
    }

    if (!item.access) {
      console.log('no access details found');
      setConnectionStatus({
        badge: 'Not connected',
        badgeState: 'warning',
        hint: 'Enter your Tube Archivist URL and API token to get started.',
        hintState: 'idle',
        collapsed: false,
      });
      updateConnectionSummary(null);
      return;
    }

    addUrl(item.access);
    updateConnectionSummary(item.access);
    pingBackend();
    setCookieState();
  }

  let initialState = await storageGet(['access', 'popupFullUrl', 'popupApiKey']);
  await onGot(initialState);
  browserType.storage.local.get('continuousSync', function (result) {
    hydrateStoredCheckbox(result, 'continuousSync', continuousSyncInput, 'continuous cookie sync not set');
  });
  browserType.storage.local.get('autostart', function (result) {
    hydrateStoredCheckbox(result, 'autostart', autostartInput, 'autostart not set');
  });
  browserType.storage.local.get('watchAutoQueue', function (result) {
    hydrateStoredCheckbox(result, 'watchAutoQueue', watchAutoQueueInput, 'watch auto queue not set');
  });
  browserType.storage.local.get('likeAutoQueue', function (result) {
    hydrateStoredCheckbox(result, 'likeAutoQueue', likeAutoQueueInput, 'like auto queue not set');
  });
});
