'use strict';

import { browserApi, sendMessage } from './api.js';
import { getCurrentPlaybackVideoId, getPlaybackPlayer, isAdShowing } from './dom-helpers.js';

export const watchAutoQueueRatioThreshold = 0.2;
export const watchAutoQueueMinSeconds = 60;
export const watchAutoQueueMaxSeconds = 600;
export const watchAutoQueueShortRatioThreshold = 0.8;
export const watchAutoQueueMaxDeltaSeconds = 2;
export const watchAutoQueueRetryCooldownMs = 30000;

export let watchAutoQueueEnabled = false;
export let watchProgressState = null;

export function setWatchAutoQueueEnabled(value) {
  watchAutoQueueEnabled = value;
}

export async function loadWatchAutoQueuePreference() {
  try {
    let stored = await browserApi.storage.local.get('watchAutoQueue');
    watchAutoQueueEnabled = stored?.watchAutoQueue?.checked === true;
  } catch (error) {
    console.error('failed to load watch auto queue preference', error);
  }
}

export function resetWatchProgressState(videoId = null) {
  watchProgressState = {
    videoId,
    watchedSeconds: 0,
    queued: false,
    queueAttemptInFlight: false,
    lastQueueAttemptAt: 0,
    lastCurrentTime: null,
    lastTickAt: null,
    lastLoggedBucket: -1,
  };
}

export function getWatchAutoQueueTargetSeconds(duration) {
  if (duration <= watchAutoQueueMinSeconds) {
    return duration * watchAutoQueueShortRatioThreshold;
  }

  return Math.min(
    Math.max(duration * watchAutoQueueRatioThreshold, watchAutoQueueMinSeconds),
    watchAutoQueueMaxSeconds
  );
}

export function logWatchProgress(message, metadata = {}) {
  console.log('[TA auto queue]', message, metadata);
}

export async function maybeAutoQueueVideo(videoId, state, reason) {
  if (!videoId || !state || state.queueAttemptInFlight) return false;
  if (Date.now() - state.lastQueueAttemptAt < watchAutoQueueRetryCooldownMs) return false;

  state.queueAttemptInFlight = true;
  state.lastQueueAttemptAt = Date.now();
  logWatchProgress('queue attempt starting', { videoId, reason });
  try {
    let existingVideoUrl = await sendMessage({ type: 'videoExists', videoId });
    if (existingVideoUrl !== false) {
      logWatchProgress('queue skipped because video already exists in TA', { videoId, reason });
      state.queued = true;
      return true;
    }

    await sendMessage({ type: 'download', url: videoId });
    logWatchProgress('queue request sent successfully', { videoId, reason });
    state.queued = true;
    return true;
  } catch (error) {
    console.error('[TA auto queue] queue request failed', { videoId, reason, error });
  } finally {
    if (state?.videoId === videoId) {
      state.queueAttemptInFlight = false;
    }
  }
  return false;
}

export async function maybeAutoQueueWatchedVideo(videoId) {
  return maybeAutoQueueVideo(videoId, watchProgressState, 'watched');
}

export function trackWatchProgress() {
  if (!watchAutoQueueEnabled) return;

  let videoId = getCurrentPlaybackVideoId();
  if (!videoId) {
    resetWatchProgressState();
    return;
  }

  if (!watchProgressState || watchProgressState.videoId !== videoId) {
    resetWatchProgressState(videoId);
    logWatchProgress('tracking started', { videoId, pathname: window.location.pathname });
  }

  let player = getPlaybackPlayer();
  if (!player || !Number.isFinite(player.duration) || player.duration <= 0 || isAdShowing()) {
    if (!player) {
      logWatchProgress('waiting for player element', { videoId });
    }
    watchProgressState.lastCurrentTime = null;
    watchProgressState.lastTickAt = Date.now();
    return;
  }

  const now = Date.now();
  const currentTime = player.currentTime;
  const duration = player.duration;
  const lastCurrentTime = watchProgressState.lastCurrentTime;
  const lastTickAt = watchProgressState.lastTickAt;

  if (!player.paused && lastCurrentTime != null && lastTickAt != null) {
    let deltaSeconds = currentTime - lastCurrentTime;
    let elapsedSeconds = (now - lastTickAt) / 1000;
    if (
      deltaSeconds > 0 &&
      deltaSeconds <= watchAutoQueueMaxDeltaSeconds &&
      deltaSeconds <= elapsedSeconds + 0.5
    ) {
      watchProgressState.watchedSeconds += deltaSeconds;
    }
  }

  watchProgressState.lastCurrentTime = currentTime;
  watchProgressState.lastTickAt = now;

  if (watchProgressState.queued) return;

  let targetSeconds = getWatchAutoQueueTargetSeconds(duration);
  let progressBucket = Math.floor(watchProgressState.watchedSeconds / 15);
  if (progressBucket > watchProgressState.lastLoggedBucket) {
    watchProgressState.lastLoggedBucket = progressBucket;
    logWatchProgress('progress update', {
      videoId,
      watchedSeconds: Math.round(watchProgressState.watchedSeconds),
      targetSeconds: Math.round(targetSeconds),
      duration: Math.round(duration),
    });
  }

  if (watchProgressState.watchedSeconds >= targetSeconds) {
    logWatchProgress('watch threshold reached', {
      videoId,
      watchedSeconds: Math.round(watchProgressState.watchedSeconds),
      targetSeconds: Math.round(targetSeconds),
    });
    maybeAutoQueueWatchedVideo(videoId);
  }
}
