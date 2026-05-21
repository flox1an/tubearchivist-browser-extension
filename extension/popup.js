/*
Loaded into popup index.html
*/

'use strict';

import { el, getBrowser } from './popup/dom.js';
import { createMetaText, formatDuration, formatPublished } from './popup/formatters.js';
import { createPagedList } from './popup/pagedList.js';
import { createRenderers } from './popup/renderers.js';
import { createServices } from './popup/services.js';
import { normalizeArchiveUiState, popupUiStateKey, toPersistedUiState } from './popup/uiState.js';

let browserType = getBrowser();
const { sendMessage, storageGet, storageSet } = createServices(browserType);
const autosaveDelayMs = 500;
const connectionToggleLockMs = 250;
const visibleDisplay = 'block';
const hiddenDisplay = 'none';

const {
  connectionCard,
  taUrlLink,
  extensionVersion,
  errorOut,
  fullUrlInput,
  apiKeyInput,
  connectionState,
  connectionToggle,
  connectionSummaryUrl,
  connectionSummaryMeta,
  saveState,
  cookieStatus,
  cookieResponseTextArea,
  showCookiesButton,
  continuousSyncInput,
  autostartInput,
  watchAutoQueueInput,
  likeAutoQueueInput,
  downloadsList,
  downloadsState,
  downloadsCount,
  downloadsSentinel,
  archiveList,
  archiveState,
  archiveCount,
  archiveSentinel,
  downloadsLink,
  downloadsRefresh,
  archiveHomeLink,
  archiveRefresh,
  archiveStats,
  archiveSearchToggle,
  archiveSearchWrap,
  archiveSearchInput,
  archiveType,
  archiveSort,
  archiveSearchClose,
} = el;

const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');

let autosaveTimeout = null;
let connectionRequestToken = 0;
let connectionCollapsed = false;
let connectionToggleLocked = false;
let archiveStatsLoaded = false;
let downloadsStatsLoaded = false;
let archiveSearchVisible = false;
let archiveSearchTerm = '';
let archiveSearchDebounceTimer = null;
let archiveSortBy = 'downloaded';
let archiveSortOrderValue = 'desc';
let archiveTypeValue = '';
let activePanelId = 'downloads-panel';
const thumbnailDataUrlCache = new Map();

function thumbnailCacheKey(item) {
  let base = item?.ta_base_url || '';
  let thumb = item?.vid_thumb_url || '';
  return `${base}|${thumb}`;
}

async function resolveThumbnailSrc(item) {
  if (!item?.vid_thumb_url) return null;

  let cacheKey = thumbnailCacheKey(item);
  if (thumbnailDataUrlCache.has(cacheKey)) {
    return thumbnailDataUrlCache.get(cacheKey);
  }

  let payload = await sendMessage({
    type: 'getThumbnailBytes',
    thumbPath: item.vid_thumb_url,
  });
  if (!payload?.base64) return null;

  let contentType = payload.contentType || 'image/jpeg';
  let dataUrl = `data:${contentType};base64,${payload.base64}`;
  thumbnailDataUrlCache.set(cacheKey, dataUrl);
  return dataUrl;
}

function setExtensionVersion() {
  extensionVersion.textContent = `v${browserType.runtime.getManifest().version}`;
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

async function persistPopupUiState() {
  let popupUiState = toPersistedUiState({
    activePanelId,
    archiveSearchVisible,
    archiveSearchTerm,
    archiveSortBy,
    archiveSortOrderValue,
    archiveTypeValue,
  });
  await storageSet({ [popupUiStateKey]: popupUiState });
}

const { renderArchiveItem, renderDownloadItem } = createRenderers({
  taUrlLink,
  formatDuration,
  formatPublished,
  createMetaText,
  resolveThumbnailSrc,
});

async function loadDownloadsStats() {
  if (downloadsStatsLoaded) return;

  try {
    let stats = await sendMessage({ type: 'getDownloadStats' });
    let pending = Number(stats?.pending);
    if (Number.isFinite(pending)) {
      setBadge(downloadsCount, pending.toLocaleString(), pending > 0 ? 'enabled' : 'idle');
      downloadsStatsLoaded = true;
    }
  } catch {
    // Keep the list-derived badge fallback on errors.
  }
}

function setConnectionCollapsed(collapsed) {
  connectionCollapsed = collapsed;
  connectionCard.dataset.collapsed = collapsed ? 'true' : 'false';
}

function setConnectionStatus({
  badge,
  badgeState,
  hint,
  hintState,
  error = null,
  collapsed = null,
}) {
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
  let baseUrl = `${formatAccessUrl(access).replace(/\/$/, '')}/`;
  taUrlLink.setAttribute('href', baseUrl);
  downloadsLink.setAttribute('href', new URL('downloads/', baseUrl).href);
  archiveHomeLink.setAttribute('href', baseUrl);
  updateConnectionSummary(access);
}

function dateKey(dateObj) {
  let year = dateObj.getFullYear();
  let month = String(dateObj.getMonth() + 1).padStart(2, '0');
  let day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function applyArchiveSearch() {
  archivePager.reset();
  if (!document.getElementById('archive-panel').hidden) {
    archivePager.loadNextPage();
  }
}

function setArchiveSearchVisibility(visible) {
  archiveSearchVisible = visible;
  archiveSearchWrap.hidden = !visible;
  archiveSearchWrap.style.display = visible ? 'flex' : 'none';
  archiveSearchToggle.setAttribute('aria-expanded', visible ? 'true' : 'false');
  archiveSearchToggle.dataset.state = visible ? 'enabled' : 'idle';
  if (visible) {
    archiveSearchInput.focus();
  }
}

function clearArchiveSearch() {
  let previous = archiveSearchTerm;
  archiveSearchInput.value = '';
  archiveSearchTerm = '';
  if (archiveSearchDebounceTimer) {
    clearTimeout(archiveSearchDebounceTimer);
    archiveSearchDebounceTimer = null;
  }
  if (previous) {
    applyArchiveSearch();
  }
  persistPopupUiState();
}

function queueArchiveSearchUpdate(value) {
  let next = value.trim();
  if (next === archiveSearchTerm) return;
  if (archiveSearchDebounceTimer) {
    clearTimeout(archiveSearchDebounceTimer);
  }
  archiveSearchDebounceTimer = window.setTimeout(() => {
    archiveSearchTerm = next;
    applyArchiveSearch();
    persistPopupUiState();
  }, 280);
}

async function loadArchiveStats() {
  if (archiveStatsLoaded) return;

  archiveStats.textContent = 'Stats loading...';
  try {
    let hist = await sendMessage({ type: 'getDownloadHistStats' });
    if (!Array.isArray(hist)) {
      throw new Error('Stats unavailable');
    }

    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let yesterdayKey = dateKey(yesterday);
    let yesterdayBucket = hist.find(item => item.date === yesterdayKey);
    let yesterdayCount = yesterdayBucket?.count ?? 0;
    archiveStats.textContent = `Added yesterday: ${yesterdayCount}`;
    archiveStats.dataset.state = 'success';
    archiveStatsLoaded = true;
  } catch (error) {
    archiveStats.textContent = error?.message ?? 'Stats unavailable';
    archiveStats.dataset.state = 'error';
  }
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
    resetApiLists();

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

  input.addEventListener('blur', async event => {
    let nextFocused = event.relatedTarget;
    if (nextFocused === fullUrlInput || nextFocused === apiKeyInput) {
      return;
    }

    // Fallback for browsers that don't reliably set relatedTarget on blur.
    window.setTimeout(async () => {
      let active = document.activeElement;
      if (active === fullUrlInput || active === apiKeyInput) {
        return;
      }
      await commitConnectionSettings();
    }, 0);
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

const downloadsPager = createPagedList({
  messageType: 'getDownloadsPage',
  listElement: downloadsList,
  stateElement: downloadsState,
  countElement: downloadsCount,
  sentinel: downloadsSentinel,
  renderItem: renderDownloadItem,
  sendMessage,
  setBadge,
  emptyEndMessage: 'Nothing to download.',
});

const archivePager = createPagedList({
  messageType: 'getArchiveVideosPage',
  listElement: archiveList,
  stateElement: archiveState,
  countElement: archiveCount,
  sentinel: archiveSentinel,
  renderItem: renderArchiveItem,
  sendMessage,
  setBadge,
  buildRequest: page => ({
    type: 'getArchiveVideosPage',
    page,
    query: archiveSearchTerm,
    sort: archiveSortBy,
    order: archiveSortOrderValue,
    videoType: archiveTypeValue,
  }),
});

function showTab(panelId) {
  activePanelId = panelId;
  for (let button of tabButtons) {
    button.setAttribute('aria-selected', button.dataset.tabTarget === panelId ? 'true' : 'false');
  }

  for (let panel of tabPanels) {
    panel.hidden = panel.id !== panelId;
  }

  if (panelId === 'downloads-panel' && !downloadsPager.loaded) {
    downloadsPager.loadNextPage();
  }
  if (panelId === 'downloads-panel') {
    loadDownloadsStats();
  }

  if (panelId === 'archive-panel' && !archivePager.loaded) {
    archivePager.loadNextPage();
  }
  if (panelId === 'archive-panel') {
    loadArchiveStats();
  }
  persistPopupUiState();
}

function reloadDownloadsList() {
  downloadsPager.reset();
  downloadsStatsLoaded = false;
  if (!document.getElementById('downloads-panel').hidden) {
    downloadsPager.loadNextPage();
    loadDownloadsStats();
  }
}

function reloadArchiveList() {
  archivePager.reset();
  archiveStatsLoaded = false;
  archiveStats.dataset.state = 'idle';
  archiveStats.textContent = 'Stats loading...';
  if (!document.getElementById('archive-panel').hidden) {
    archivePager.loadNextPage();
    loadArchiveStats();
  }
}

function resetApiLists() {
  downloadsPager.reset();
  archivePager.reset();
  archiveStatsLoaded = false;
  downloadsStatsLoaded = false;
  archiveStats.dataset.state = 'idle';
  archiveStats.textContent = 'Stats loading...';

  if (!document.getElementById('downloads-panel').hidden) {
    downloadsPager.loadNextPage();
    loadDownloadsStats();
  }

  if (!document.getElementById('archive-panel').hidden) {
    archivePager.loadNextPage();
    loadArchiveStats();
  }
}

function hasConfiguredAccess(access) {
  return Boolean(access?.url && access?.apiKey);
}

for (let button of tabButtons) {
  button.addEventListener('click', () => {
    showTab(button.dataset.tabTarget);
  });
}

archiveSearchToggle.addEventListener('click', () => {
  if (archiveSearchVisible) {
    clearArchiveSearch();
    setArchiveSearchVisibility(false);
    return;
  }
  setArchiveSearchVisibility(true);
  persistPopupUiState();
});

archiveSearchClose.addEventListener('click', () => {
  clearArchiveSearch();
  setArchiveSearchVisibility(false);
  persistPopupUiState();
});

archiveSearchInput.addEventListener('input', event => {
  queueArchiveSearchUpdate(event.target.value || '');
});

archiveSort.addEventListener('change', event => {
  let selected = String(event.target.value || 'downloaded:desc');
  let [sortBy, sortOrder] = selected.split(':');
  archiveSortBy = sortBy === 'published' ? 'published' : 'downloaded';
  archiveSortOrderValue = sortOrder === 'asc' ? 'asc' : 'desc';
  applyArchiveSearch();
  persistPopupUiState();
});

archiveType.addEventListener('change', event => {
  let value = String(event.target.value || '');
  archiveTypeValue = value === 'videos' || value === 'shorts' || value === 'streams' ? value : '';
  applyArchiveSearch();
  persistPopupUiState();
});

archiveSearchInput.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    event.preventDefault();
    clearArchiveSearch();
    setArchiveSearchVisibility(false);
    persistPopupUiState();
  }
});

downloadsRefresh.addEventListener('click', () => {
  reloadDownloadsList();
});

archiveRefresh.addEventListener('click', () => {
  reloadArchiveList();
});

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
  setArchiveSearchVisibility(false);

  async function onGot(item) {
    let savedUiState = normalizeArchiveUiState(item[popupUiStateKey]);
    archiveSortBy = savedUiState.archiveSortBy;
    archiveSortOrderValue = savedUiState.archiveSortOrderValue;
    archiveSort.value = `${archiveSortBy}:${archiveSortOrderValue}`;
    archiveTypeValue = savedUiState.archiveTypeValue;
    archiveType.value = archiveTypeValue;
    archiveSearchTerm = savedUiState.archiveSearchTerm;
    archiveSearchInput.value = archiveSearchTerm;
    if (savedUiState.archiveSearchVisible) {
      setArchiveSearchVisibility(true);
    }

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
      showTab('settings-panel');
      return;
    }

    addUrl(item.access);
    updateConnectionSummary(item.access);
    if (!hasConfiguredAccess(item.access)) {
      showTab('settings-panel');
    } else {
      let nextPanel = savedUiState.activePanelId;
      if (
        nextPanel !== 'downloads-panel' &&
        nextPanel !== 'archive-panel' &&
        nextPanel !== 'settings-panel'
      ) {
        nextPanel = 'downloads-panel';
      }
      showTab(nextPanel || 'downloads-panel');
    }
    pingBackend();
    setCookieState();
  }

  let initialState = await storageGet(['access', 'popupFullUrl', 'popupApiKey', popupUiStateKey]);
  await onGot(initialState);
  browserType.storage.local.get('continuousSync', function (result) {
    hydrateStoredCheckbox(
      result,
      'continuousSync',
      continuousSyncInput,
      'continuous cookie sync not set'
    );
  });
  browserType.storage.local.get('autostart', function (result) {
    hydrateStoredCheckbox(result, 'autostart', autostartInput, 'autostart not set');
  });
  browserType.storage.local.get('watchAutoQueue', function (result) {
    hydrateStoredCheckbox(
      result,
      'watchAutoQueue',
      watchAutoQueueInput,
      'watch auto queue not set'
    );
  });
  browserType.storage.local.get('likeAutoQueue', function (result) {
    hydrateStoredCheckbox(result, 'likeAutoQueue', likeAutoQueueInput, 'like auto queue not set');
  });
});
