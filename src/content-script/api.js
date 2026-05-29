'use strict';

export const videoExistsCache = new Map();
const videoExistsInflight = new Map();

export function getBrowser() {
  if (typeof chrome !== 'undefined') {
    if (typeof browser !== 'undefined') {
      return browser;
    } else {
      return chrome;
    }
  } else {
    if (typeof browser !== 'undefined') {
      return browser;
    }
    throw new Error('Browser API not found');
  }
}

export const browserApi = getBrowser();

export async function sendMessage(message) {
  let response;
  try {
    response = await browserApi.runtime.sendMessage(message);
  } catch (e) {
    if (e?.message?.includes('Extension context invalidated')) return;
    throw e;
  }
  let { success, value } = response;
  if (!success) {
    throw value;
  }
  return value;
}

export function t(key, fallbackValue) {
  if (browserApi && browserApi.i18n) {
    const msg = browserApi.i18n.getMessage(key);
    if (msg) return msg;
  }
  return fallbackValue;
}

export function checkVideoExists(taButton, setButtonOpenState, setButtonDefaultState) {
  let videoId = taButton.dataset.id;
  if (!videoId) return;

  function applyExistsState(message) {
    if (taButton.dataset.id !== videoId) return;

    if (typeof message === 'string' && message) {
      setButtonOpenState(taButton, message);
    } else {
      setButtonDefaultState(taButton);
    }
    taButton.isChecked = true;
  }
  function handleError(e) {
    if (taButton.dataset.id !== videoId) return;

    setButtonDefaultState(taButton);
    taButton.isChecked = true;
    console.log(`error: failed to get info from TA for video ${videoId}`);
    console.error(e);
  }

  if (videoExistsCache.has(videoId)) {
    let cached = videoExistsCache.get(videoId);
    if (cached === true) {
      // Legacy invalid cached value from old logic: treat as unknown.
      videoExistsCache.delete(videoId);
    } else {
      applyExistsState(cached);
      return;
    }
  }

  if (videoExistsInflight.has(videoId)) {
    videoExistsInflight.get(videoId).then(applyExistsState, handleError);
    return;
  }

  let requestPromise = sendMessage({ type: 'videoExists', videoId });
  videoExistsInflight.set(videoId, requestPromise);
  requestPromise
    .then(message => {
      videoExistsCache.set(videoId, message);
      applyExistsState(message);
    })
    .catch(handleError)
    .finally(() => {
      videoExistsInflight.delete(videoId);
    });
}
