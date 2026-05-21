'use strict';

import { browserApi } from './api.js';
import {
  getCurrentPlaybackContainer,
  getCurrentPlaybackVideoId,
  getElementViewportIntersectionArea,
  parseShortsVideoIdFromHref,
} from './dom-helpers.js';
import { shortsLinkSelector } from '../common/selectors.js';
import { maybeAutoQueueVideo, logWatchProgress } from './watch-progress.js';

export let likeAutoQueueEnabled = false;
export let likeQueueState = null;

export function setLikeAutoQueueEnabled(value) {
  likeAutoQueueEnabled = value;
}

export async function loadLikeAutoQueuePreference() {
  try {
    let stored = await browserApi.storage.local.get('likeAutoQueue');
    likeAutoQueueEnabled = stored?.likeAutoQueue?.checked === true;
  } catch (error) {
    console.error('failed to load like auto queue preference', error);
  }
}

export function resetLikeQueueState(videoId = null) {
  likeQueueState = {
    videoId,
    queued: false,
    queueAttemptInFlight: false,
    lastQueueAttemptAt: 0,
    lastLiked: false,
  };
}

export function getLikeButtons() {
  return [
    ...document.querySelectorAll(
      [
        'like-button-view-model button[aria-pressed]',
        'segmented-like-dislike-button-view-model button[aria-pressed]',
        'ytd-toggle-button-renderer button[aria-pressed]',
        'toggle-button-view-model button[aria-pressed]',
        'like-button-view-model button',
        'segmented-like-dislike-button-view-model button',
      ].join(', ')
    ),
  ];
}

export function isLikeButton(button) {
  if (!button) return false;
  let label = [
    button.getAttribute('aria-label'),
    button.getAttribute('title'),
    button.textContent,
    button.closest('[aria-label]')?.getAttribute('aria-label'),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return label.includes('like') || label.includes('mag ich') || label.includes('gefällt');
}

export function getCurrentLikeButton() {
  let playbackContainer = getCurrentPlaybackContainer();
  if (playbackContainer) {
    let buttonInPlaybackContainer = [...playbackContainer.querySelectorAll('button')].find(button =>
      isLikeButton(button)
    );
    if (buttonInPlaybackContainer) return buttonInPlaybackContainer;
  }

  let videoId = getCurrentPlaybackVideoId();
  if (window.location.pathname.startsWith('/shorts/') && videoId) {
    let matchingShortsContainer = [...document.querySelectorAll('ytd-reel-video-renderer')].find(
      container => {
        let link = container.querySelector(shortsLinkSelector);
        return parseShortsVideoIdFromHref(link?.getAttribute('href')) === videoId;
      }
    );
    let buttonInMatchingShortsContainer = [
      ...(matchingShortsContainer?.querySelectorAll('button') || []),
    ].find(button => isLikeButton(button));
    if (buttonInMatchingShortsContainer) return buttonInMatchingShortsContainer;
  }

  let visibleLikeButtons = getLikeButtons()
    .filter(button => isLikeButton(button))
    .map(button => ({ button, area: getElementViewportIntersectionArea(button) }))
    .filter(item => item.area > 0)
    .sort((left, right) => right.area - left.area);

  return visibleLikeButtons[0]?.button || null;
}

export function isVideoLiked(button) {
  return button?.getAttribute('aria-pressed') === 'true';
}

export function trackLikedVideoState() {
  if (!likeAutoQueueEnabled) return;

  let videoId = getCurrentPlaybackVideoId();
  if (!videoId) {
    resetLikeQueueState();
    return;
  }

  if (!likeQueueState || likeQueueState.videoId !== videoId) {
    resetLikeQueueState(videoId);
    logWatchProgress('like tracking started', { videoId, pathname: window.location.pathname });
  }

  let likeButton = getCurrentLikeButton();
  if (!likeButton) {
    logWatchProgress('waiting for like button', { videoId });
    return;
  }

  let liked = isVideoLiked(likeButton);
  if (liked && !likeQueueState.lastLiked && !likeQueueState.queued) {
    logWatchProgress('like detected', { videoId });
    maybeAutoQueueVideo(videoId, likeQueueState, 'liked');
  }

  likeQueueState.lastLiked = liked;
}
