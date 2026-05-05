/*
content script running on youtube.com
*/

'use strict';

const downloadIcon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
<style type="text/css">
.st0{display:none;}
.st1{display:inline;}
</style>
<g class="st0">
<g class="st1">
   <g>
       <rect x="49.8" y="437.8" width="400.4" height="32.4"/>
   </g>
   <g>
       <g>
           <path d="M49.8,193c2-9.4,7.6-16.4,14.5-22.6c2.9-2.6,5.5-5.5,8.3-8.3c13.1-12.9,31.6-13,44.6,0c23,22.9,45.9,45.9,68.8,68.8
               c0.7,0.7,1.5,1.4,2.5,2.4c1.1-1.1,2.2-2.1,3.3-3.1c63.4-63.4,126.8-126.8,190.2-190.2c10.7-10.7,24.6-13.3,37.1-6.7
               c2.9,1.6,5.6,3.8,8.1,6c4.2,3.9,8.2,8.1,12.2,12.1c14.3,14.3,14.3,32.4,0.1,46.6c-20.2,20.3-40.5,40.5-60.8,60.8
               C321,216.8,263.2,274.6,205.4,332.4c-11.2,11.2-22.4,11.2-33.6,0c-35.7-35.7-71.4-71.6-107.3-107.2
               c-6.7-6.6-12.7-13.4-14.8-22.8C49.8,199.2,49.8,196.1,49.8,193z"/>
       </g>
   </g>
</g>
</g>
<g>
<rect x="237.9" y="313.5" transform="matrix(-1.836970e-16 1 -1 -1.836970e-16 708.0891 208.8956)" width="23.4" height="289.9"/>
<g>
   <g>
       <path d="M190.6,195.1c-21.7,0-42.5,0.1-63.4,0c-8.2,0-14.4,3-17.8,10.6c-3.5,7.9-1.3,14.6,4.5,20.7
           c40.6,42.4,81,84.9,121.6,127.3c8.9,9.3,19.1,9.4,28,0.1c40.7-42.5,81.3-85.1,122-127.7c5.6-5.9,7.6-12.6,4.3-20.3
           c-3.3-7.6-9.5-10.8-17.7-10.7c-19,0.1-38,0-57,0c-2,0-3.9,0-6.5,0c0-2.8,0-5,0-7.1c0-42.3,0.1-84.5,0-126.8
           c0-19.4-12.1-31.3-31.5-31.4c-17.9-0.1-35.8,0-53.7,0c-21.2,0-32.7,11.6-32.7,32.9c0,41.7,0,83.4,0,125.1
           C190.6,190,190.6,192.2,190.6,195.1z"/>
       <path d="M190.6,195.1c0-2.9,0-5.1,0-7.3c0-41.7,0-83.4,0-125.1c0-21.3,11.5-32.9,32.7-32.9c17.9,0,35.8-0.1,53.7,0
           c19.4,0.1,31.5,12,31.5,31.4c0.1,42.3,0,84.5,0,126.8c0,2.2,0,4.4,0,7.1c2.5,0,4.5,0,6.5,0c19,0,38,0.1,57,0
           c8.2,0,14.4,3.1,17.7,10.7c3.4,7.6,1.3,14.4-4.3,20.3c-40.7,42.6-81.3,85.2-122,127.7c-8.8,9.2-19.1,9.2-28-0.1
           c-40.5-42.4-81-84.9-121.6-127.3c-5.8-6.1-8-12.8-4.5-20.7c3.4-7.6,9.6-10.7,17.8-10.6C148.1,195.2,168.9,195.1,190.6,195.1z"/>
   </g>
</g>
</g>
</svg>`;

const checkmarkIcon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
<style type="text/css">
.st0{display:none;}
.st1{display:inline;}
</style>
<g>
<g>
   <g>
       <rect x="49.8" y="437.8" width="400.4" height="32.4"/>
   </g>
   <g>
       <g>
           <path d="M49.8,193c2-9.4,7.6-16.4,14.5-22.6c2.9-2.6,5.5-5.5,8.3-8.3c13.1-12.9,31.6-13,44.6,0c23,22.9,45.9,45.9,68.8,68.8
               c0.7,0.7,1.5,1.4,2.5,2.4c1.1-1.1,2.2-2.1,3.3-3.1c63.4-63.4,126.8-126.8,190.2-190.2c10.7-10.7,24.6-13.3,37.1-6.7
               c2.9,1.6,5.6,3.8,8.1,6c4.2,3.9,8.2,8.1,12.2,12.1c14.3,14.3,14.3,32.4,0.1,46.6c-20.2,20.3-40.5,40.5-60.8,60.8
               C321,216.8,263.2,274.6,205.4,332.4c-11.2,11.2-22.4,11.2-33.6,0c-35.7-35.7-71.4-71.6-107.3-107.2
               c-6.7-6.6-12.7-13.4-14.8-22.8C49.8,199.2,49.8,196.1,49.8,193z"/>
       </g>
   </g>
</g>
</g>
<g class="st0">

   <rect x="237.9" y="313.5" transform="matrix(-1.836970e-16 1 -1 -1.836970e-16 708.0891 208.8956)" class="st1" width="23.4" height="289.9"/>
<g class="st1">
   <g>
       <path d="M190.6,195.1c-21.7,0-42.5,0.1-63.4,0c-8.2,0-14.4,3-17.8,10.6c-3.5,7.9-1.3,14.6,4.5,20.7
           c40.6,42.4,81,84.9,121.6,127.3c8.9,9.3,19.1,9.4,28,0.1c40.7-42.5,81.3-85.1,122-127.7c5.6-5.9,7.6-12.6,4.3-20.3
           c-3.3-7.6-9.5-10.8-17.7-10.7c-19,0.1-38,0-57,0c-2,0-3.9,0-6.5,0c0-2.8,0-5,0-7.1c0-42.3,0.1-84.5,0-126.8
           c0-19.4-12.1-31.3-31.5-31.4c-17.9-0.1-35.8,0-53.7,0c-21.2,0-32.7,11.6-32.7,32.9c0,41.7,0,83.4,0,125.1
           C190.6,190,190.6,192.2,190.6,195.1z"/>
       <path d="M190.6,195.1c0-2.9,0-5.1,0-7.3c0-41.7,0-83.4,0-125.1c0-21.3,11.5-32.9,32.7-32.9c17.9,0,35.8-0.1,53.7,0
           c19.4,0.1,31.5,12,31.5,31.4c0.1,42.3,0,84.5,0,126.8c0,2.2,0,4.4,0,7.1c2.5,0,4.5,0,6.5,0c19,0,38,0.1,57,0
           c8.2,0,14.4,3.1,17.7,10.7c3.4,7.6,1.3,14.4-4.3,20.3c-40.7,42.6-81.3,85.2-122,127.7c-8.8,9.2-19.1,9.2-28-0.1
           c-40.5-42.4-81-84.9-121.6-127.3c-5.8-6.1-8-12.8-4.5-20.7c3.4-7.6,9.6-10.7,17.8-10.6C148.1,195.2,168.9,195.1,190.6,195.1z"/>
   </g>
</g>
</g>
</svg>`;

const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>minus-thick</title><path d="M20 14H4V10H20" /></svg>`;
const queuedIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>clock-outline</title><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm.5-13h-1v6l5.2 3.1.5-.9-4.7-2.7Z"/></svg>`;

const taButtonDefaultBackground = 'rgba(3, 21, 33, 0.82)';
const taButtonHoverBackground = 'rgba(39, 82, 105, 0.98)';
const taButtonBorder = 'rgba(151, 212, 200, 0.26)';
const taButtonDivider = 'rgba(151, 212, 200, 0.2)';
const taButtonDefaultForeground = '#ecfff9';
const taButtonHoverForeground = '#52e0bf';
const taButtonIconDefaultFilter = 'invert()';
const taButtonIconHoverFilter =
  'invert(84%) sepia(47%) saturate(541%) hue-rotate(108deg) brightness(95%) contrast(86%)';
const taButtonZIndex = 999999;

function getDownloadButtonIconElement(button) {
  return button.querySelector('span');
}

function applyDownloadButtonDefaultStyle(button) {
  Object.assign(button.style, {
    backgroundColor: taButtonDefaultBackground,
    borderColor: taButtonBorder,
    boxShadow: 'none',
    color: taButtonDefaultForeground,
  });
  let icon = getDownloadButtonIconElement(button);
  if (icon) icon.style.filter = taButtonIconDefaultFilter;
}

function applyDownloadButtonHoverStyle(button) {
  Object.assign(button.style, {
    backgroundColor: taButtonHoverBackground,
    borderColor: taButtonBorder,
    boxShadow: 'none',
    color: taButtonHoverForeground,
  });
  let icon = getDownloadButtonIconElement(button);
  if (icon) icon.style.filter = taButtonIconHoverFilter;
}

function attachDownloadButtonHoverStyle(button) {
  button.addEventListener('mouseenter', () => applyDownloadButtonHoverStyle(button));
  button.addEventListener('mouseleave', () => applyDownloadButtonDefaultStyle(button));
}

function stopYouTubeThumbnailEvent(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation?.();
}

function captureDownloadButtonPointerEvents(element) {
  ['pointerdown', 'mousedown', 'mouseup', 'touchstart', 'touchend'].forEach(eventName => {
    element.addEventListener(eventName, stopYouTubeThumbnailEvent, true);
  });
}

function attachSegmentHoverStyle(segment) {
  segment.addEventListener('mouseenter', () => {
    segment.style.backgroundColor = taButtonHoverBackground;
    segment.style.color = taButtonHoverForeground;
  });
  segment.addEventListener('mouseleave', () => {
    segment.style.backgroundColor = 'transparent';
    segment.style.color = 'inherit';
  });
}

function styleChannelDownloadSegmentIcon(button) {
  if (!button.classList.contains('ta-channel-download-segment')) return;
  let iconWrapper = button.querySelector('.ta-channel-download-icon-wrap');
  if (!iconWrapper) {
    let icon = button.querySelector('svg');
    if (!icon) return;
    iconWrapper = document.createElement('span');
    iconWrapper.classList.add('ta-channel-download-icon-wrap');
    icon.replaceWith(iconWrapper);
    iconWrapper.appendChild(icon);
  }
  Object.assign(iconWrapper.style, {
    width: '14px',
    height: '14px',
    maxWidth: '14px',
    maxHeight: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 14px',
    overflow: 'hidden',
    color: 'currentColor',
  });
  let icon = iconWrapper.querySelector('svg');
  if (!icon) return;
  icon.removeAttribute('width');
  icon.removeAttribute('height');
  Object.assign(icon.style, {
    width: '16px',
    height: '16px',
    maxWidth: '16px',
    maxHeight: '16px',
    display: 'block',
    flex: '0 0 16px',
    fill: 'currentColor',
  });
}

let browserType = getBrowser();
const watchAutoQueueRatioThreshold = 0.2;
const watchAutoQueueMinSeconds = 60;
const watchAutoQueueMaxSeconds = 600;
const watchAutoQueueShortRatioThreshold = 0.8;
const watchAutoQueuePollMs = 1000;
const watchAutoQueueMaxDeltaSeconds = 2;
const watchAutoQueueRetryCooldownMs = 30000;
const injectThrottleMs = 120;
const videoExistsCache = new Map();
const videoExistsInflight = new Map();
let watchAutoQueueEnabled = false;
let likeAutoQueueEnabled = false;
let watchProgressState = null;
let watchProgressPlayer = null;
let likeQueueState = null;
const shortsLinkSelector = 'a[href^="/shorts/"], a[href*="youtube.com/shorts/"]';
const shortsVideoContainerSelector = [
  'ytd-reel-video-renderer',
  'ytd-reel-player-overlay-renderer',
  'reel-action-bar-view-model',
  'ytd-shorts',
  'ytd-player',
].join(', ');

const titleContainerSelector = [
  '#video-title',
  'a.ytLockupMetadataViewModelTitle',
  'a[href^="/shorts/"]',
].join(', ');

const videoCardRootSelector = [
  'yt-lockup-view-model',
  'yt-lockup-metadata-view-model',
  'ytd-rich-grid-media',
  'ytd-rich-item-renderer',
  'ytd-video-renderer',
  'ytd-compact-video-renderer',
  'ytd-grid-video-renderer',
  'ytd-playlist-video-renderer',
].join(', ');

const videoLinkSelector = [
  'a[href^="/watch"]',
  'a[href^="/shorts/"]',
  'a[href*="youtube.com/watch"]',
  'a[href*="youtube.com/shorts/"]',
].join(', ');

const videoButtonVariantStyles = {
  lockup: {
    position: 'absolute',
    top: 0,
    right: '32px',
    zIndex: taButtonZIndex,
  },
  'lockup-menu-below': {
    position: 'absolute',
    top: '32px',
    right: '-10px',
    zIndex: taButtonZIndex,
  },
  'playlist-menu-below': {
    position: 'relative',
    top: 'auto',
    right: 'auto',
    marginTop: '8px',
    zIndex: taButtonZIndex,
  },
  default: {
    position: 'absolute',
    top: 0,
    right: '32px',
    zIndex: taButtonZIndex,
  },
  'shorts-grid': {
    position: 'absolute',
    top: '8px',
    right: '8px',
    zIndex: taButtonZIndex,
  },
};

// boilerplate to dedect browser type api
function getBrowser() {
  if (typeof chrome !== 'undefined') {
    if (typeof browser !== 'undefined') {
      console.log('detected firefox');
      return browser;
    } else {
      console.log('detected chrome');
      return chrome;
    }
  } else {
    console.log('failed to dedect browser');
    throw 'browser detection error';
  }
}

function getChannelContainers() {
  const elements = document.querySelectorAll(
    'yt-flexible-actions-view-model.ytPageHeaderViewModelFlexibleActions, #owner'
  );
  const channelContainerNodes = [];

  elements.forEach(element => {
    if (isElementVisible(element) && window.location.pathname !== '/playlist') {
      channelContainerNodes.push(element);
    }
  });

  return channelContainerNodes;
}

async function loadWatchAutoQueuePreference() {
  try {
    let stored = await browserType.storage.local.get('watchAutoQueue');
    watchAutoQueueEnabled = stored?.watchAutoQueue?.checked === true;
  } catch (error) {
    console.error('failed to load watch auto queue preference', error);
  }
}

async function loadLikeAutoQueuePreference() {
  try {
    let stored = await browserType.storage.local.get('likeAutoQueue');
    likeAutoQueueEnabled = stored?.likeAutoQueue?.checked === true;
  } catch (error) {
    console.error('failed to load like auto queue preference', error);
  }
}

function resetWatchProgressState(videoId = null) {
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

function resetLikeQueueState(videoId = null) {
  likeQueueState = {
    videoId,
    queued: false,
    queueAttemptInFlight: false,
    lastQueueAttemptAt: 0,
    lastLiked: false,
  };
}

function parseShortsVideoIdFromHref(href) {
  if (!href) return null;
  try {
    const url = new URL(href, window.location.href);
    if (!url.pathname.startsWith('/shorts/')) return null;
    return url.pathname.split('/')[2] || null;
  } catch {
    return null;
  }
}

function getElementViewportIntersectionArea(element) {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const width = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
  const height = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
  return width * height;
}

function getVideoIdFromShortsContext(element) {
  if (!element) return null;

  let container = element.closest(shortsVideoContainerSelector);
  while (container) {
    let directLink = container.matches(shortsLinkSelector)
      ? container
      : container.querySelector(shortsLinkSelector);
    let videoId = parseShortsVideoIdFromHref(directLink?.getAttribute('href'));
    if (videoId) return videoId;

    container = container.parentElement?.closest(shortsVideoContainerSelector) || null;
  }

  let nearbyLink = element.closest(shortsLinkSelector);
  return parseShortsVideoIdFromHref(nearbyLink?.getAttribute('href'));
}

function getShortsVideoIdFromViewport() {
  const points = [
    [window.innerWidth / 2, window.innerHeight / 2],
    [window.innerWidth / 2, window.innerHeight * 0.65],
    [window.innerWidth / 2, window.innerHeight * 0.35],
  ];

  for (let [x, y] of points) {
    for (let element of document.elementsFromPoint(x, y)) {
      let videoId = getVideoIdFromShortsContext(element);
      if (videoId) return videoId;
    }
  }

  return null;
}

function getShortsVideoIdFromVisibleLinks() {
  let bestCandidate = null;
  let bestArea = 0;

  for (let link of document.querySelectorAll(shortsLinkSelector)) {
    let videoId = parseShortsVideoIdFromHref(link.getAttribute('href'));
    if (!videoId) continue;

    let area = getElementViewportIntersectionArea(link);
    if (area > bestArea) {
      bestArea = area;
      bestCandidate = videoId;
    }
  }

  return bestCandidate;
}

function getShortsPlaybackContainerFromViewport() {
  const points = [
    [window.innerWidth / 2, window.innerHeight / 2],
    [window.innerWidth / 2, window.innerHeight * 0.65],
    [window.innerWidth / 2, window.innerHeight * 0.35],
  ];

  for (let [x, y] of points) {
    for (let element of document.elementsFromPoint(x, y)) {
      let container = element.closest('ytd-reel-video-renderer, ytd-reel-player-overlay-renderer');
      if (container) return container;
    }
  }

  return null;
}

function getPlaybackPlayer() {
  const players = [...document.querySelectorAll('video.html5-main-video, ytd-player video, video')];
  if (players.length <= 1) return players[0] || null;

  players.sort((left, right) => {
    const playingScore = Number(!right.paused) - Number(!left.paused);
    if (playingScore !== 0) return playingScore;

    return getElementViewportIntersectionArea(right) - getElementViewportIntersectionArea(left);
  });

  return players[0] || null;
}

function getCurrentPlaybackContainer() {
  let player = getPlaybackPlayer();
  if (window.location.pathname.startsWith('/shorts/')) {
    return (
      getShortsPlaybackContainerFromViewport() ||
      player?.closest('ytd-reel-video-renderer, ytd-reel-player-overlay-renderer, ytd-shorts') ||
      null
    );
  }

  return player?.closest('ytd-watch-flexy, ytd-player, #columns, #primary, body') || null;
}

function getCurrentPlaybackVideoId() {
  if (window.location.pathname === '/watch') {
    return new URLSearchParams(window.location.search).get('v');
  }

  if (window.location.pathname.startsWith('/shorts/')) {
    let player = getPlaybackPlayer();
    let videoId =
      getVideoIdFromShortsContext(player) ||
      getShortsVideoIdFromViewport() ||
      getShortsVideoIdFromVisibleLinks();
    return videoId || window.location.pathname.split('/')[2] || null;
  }

  return null;
}

function isAdShowing() {
  return Boolean(document.querySelector('.html5-video-player.ad-showing'));
}

function getWatchAutoQueueTargetSeconds(duration) {
  if (duration <= watchAutoQueueMinSeconds) {
    return duration * watchAutoQueueShortRatioThreshold;
  }

  return Math.min(
    Math.max(duration * watchAutoQueueRatioThreshold, watchAutoQueueMinSeconds),
    watchAutoQueueMaxSeconds
  );
}

function logWatchProgress(message, metadata = {}) {
  console.log('[TA auto queue]', message, metadata);
}

async function maybeAutoQueueVideo(videoId, state, reason) {
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

async function maybeAutoQueueWatchedVideo(videoId) {
  return maybeAutoQueueVideo(videoId, watchProgressState, 'watched');
}

function trackWatchProgress() {
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

function handlePlaybackEvent() {
  trackWatchProgress();
  trackLikedVideoState();
}

function detachWatchProgressListeners() {
  if (!watchProgressPlayer) return;

  watchProgressPlayer.removeEventListener('timeupdate', handlePlaybackEvent);
  watchProgressPlayer.removeEventListener('play', handlePlaybackEvent);
  watchProgressPlayer.removeEventListener('playing', handlePlaybackEvent);
  watchProgressPlayer.removeEventListener('pause', handlePlaybackEvent);
  watchProgressPlayer.removeEventListener('loadedmetadata', handlePlaybackEvent);
  watchProgressPlayer.removeEventListener('durationchange', handlePlaybackEvent);
  watchProgressPlayer.removeEventListener('seeking', handlePlaybackEvent);
  watchProgressPlayer.removeEventListener('seeked', handlePlaybackEvent);
  watchProgressPlayer = null;
}

function attachWatchProgressListeners() {
  let player = getPlaybackPlayer();
  if (player === watchProgressPlayer) return;

  detachWatchProgressListeners();
  if (!player) return;

  watchProgressPlayer = player;
  player.addEventListener('timeupdate', handlePlaybackEvent);
  player.addEventListener('play', handlePlaybackEvent);
  player.addEventListener('playing', handlePlaybackEvent);
  player.addEventListener('pause', handlePlaybackEvent);
  player.addEventListener('loadedmetadata', handlePlaybackEvent);
  player.addEventListener('durationchange', handlePlaybackEvent);
  player.addEventListener('seeking', handlePlaybackEvent);
  player.addEventListener('seeked', handlePlaybackEvent);
}

function getLikeButtons() {
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

function isLikeButton(button) {
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

function getCurrentLikeButton() {
  let playbackContainer = getCurrentPlaybackContainer();
  if (playbackContainer) {
    let buttonInPlaybackContainer = [...playbackContainer.querySelectorAll('button')].find(button =>
      isLikeButton(button)
    );
    if (buttonInPlaybackContainer) return buttonInPlaybackContainer;
  }

  let videoId = getCurrentPlaybackVideoId();
  if (window.location.pathname.startsWith('/shorts/') && videoId) {
    let matchingShortsContainer = [...document.querySelectorAll('ytd-reel-video-renderer')].find(container => {
      let link = container.querySelector(shortsLinkSelector);
      return parseShortsVideoIdFromHref(link?.getAttribute('href')) === videoId;
    });
    let buttonInMatchingShortsContainer = [...(matchingShortsContainer?.querySelectorAll('button') || [])].find(
      button => isLikeButton(button)
    );
    if (buttonInMatchingShortsContainer) return buttonInMatchingShortsContainer;
  }

  let visibleLikeButtons = getLikeButtons()
    .filter(button => isLikeButton(button))
    .map(button => ({ button, area: getElementViewportIntersectionArea(button) }))
    .filter(item => item.area > 0)
    .sort((left, right) => right.area - left.area);

  return visibleLikeButtons[0]?.button || null;
}

function isVideoLiked(button) {
  return button?.getAttribute('aria-pressed') === 'true';
}

function trackLikedVideoState() {
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

function isElementVisible(element) {
  return element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0;
}

function ensureTALinks() {
  ensureThumbnailHoverOverlayButtons();
  ensureShortsThumbnailFallbackButtons();

  let shortsContainer = getShortsContainer();
  if (shortsContainer) {
    if (shortsContainer.hasTA && !shortsContainer.querySelector('.ta-shorts-button')) {
      shortsContainer.hasTA = false;
    }
    if (!shortsContainer.hasTA) {
      let result = buildShortsButton();
      if (result) {
        let { wrapper, btn } = result;
        shortsContainer.insertBefore(wrapper, shortsContainer.firstElementChild);
        shortsContainer.hasTA = true;
        checkVideoExists(btn);
      }
    }
  }

  let channelContainerNodes = getChannelContainers();

  for (let channelContainer of channelContainerNodes) {
    channelContainer = adjustOwner(channelContainer);
    if (channelContainer.hasTA) continue;
    let channelButton = buildChannelButton(channelContainer);
    channelContainer.appendChild(channelButton);
    channelContainer.hasTA = true;
  }

  let titleContainerNodes = getTitleContainers();
  for (let titleContainer of titleContainerNodes) {
    let placement = getVideoButtonPlacement(titleContainer);
    if (!placement) continue;

    let existingButton = findExistingVideoButton(titleContainer);
    let existingInTarget = placement.container.querySelector('.ta-button');

    if (existingInTarget) continue;
    if (existingButton && existingButton.parentElement === placement.container) continue;

    if (existingButton && existingButton.parentElement) {
      existingButton.remove();
    }

    let videoButton = buildVideoButton(titleContainer, { variant: placement.variant });
    if (videoButton == null) continue;

    prepareVideoButtonContainer(placement.container, videoButton);
    if (placement.insertBefore) {
      placement.container.insertBefore(videoButton, placement.insertBefore);
    } else {
      placement.container.appendChild(videoButton);
    }
  }
}
ensureTALinks = throttled(ensureTALinks, injectThrottleMs);

function findExistingVideoButton(titleContainer) {
  let videoId = getVideoId(titleContainer);
  if (!videoId) return null;
  return document.querySelector(`.ta-button[data-id="${CSS.escape(videoId)}"]`);
}

function ensureThumbnailHoverOverlayButtons() {
  let overlays = document.querySelectorAll('yt-thumbnail-hover-overlay-toggle-actions-view-model');
  for (let overlay of overlays) {
    ensureThumbnailHoverOverlayButton(overlay);
  }
}

function ensureShortsThumbnailFallbackButtons() {
  let thumbnails = document.querySelectorAll('yt-thumbnail-view-model');
  for (let thumbnail of thumbnails) {
    if (thumbnail.querySelector('yt-thumbnail-hover-overlay-toggle-actions-view-model')) continue;
    if (thumbnail.querySelector('.ta-button')) continue;

    let lockupHost = thumbnail.closest('.ytLockupViewModelHost');
    let hasCompactMenuPlacement = Boolean(
      lockupHost?.querySelector(
        'yt-lockup-metadata-view-model.ytLockupMetadataViewModelCompact .ytLockupMetadataViewModelMenuButton'
      )
    );
    if (hasCompactMenuPlacement) continue;

    let videoId = getVideoIdForThumbnailViewModel(thumbnail);
    if (!videoId) continue;
    if (!isShortsVideoHref(getVideoHrefForThumbnailViewModel(thumbnail))) continue;

    if (!thumbnail.style.position) {
      thumbnail.style.position = 'relative';
    }

    let button = createRoundedDownloadButton(videoId, {
      title: `TA download video: ${videoId}`,
      size: 32,
      iconSize: 16,
      asButton: true,
    });
    Object.assign(button.style, {
      position: 'absolute',
      top: '8px',
      right: '8px',
      zIndex: taButtonZIndex,
    });

    thumbnail.appendChild(button);
    checkVideoExists(button);
  }
}

function ensureThumbnailHoverOverlayButton(overlay) {
  if (!overlay || overlay.querySelector('.ta-button')) return false;

  let videoId = getVideoIdForHoverOverlay(overlay);
  if (!videoId) return false;

  let actionRow = document.createElement('div');
  actionRow.className = 'ytThumbnailHoverOverlayToggleActionsViewModelButton';
  actionRow.style.zIndex = taButtonZIndex;
  actionRow.style.pointerEvents = 'auto';
  captureDownloadButtonPointerEvents(actionRow);

  let taButton = buildHoverOverlayVideoButton(videoId);
  actionRow.appendChild(taButton);
  overlay.appendChild(actionRow);

  checkVideoExists(taButton);
  return true;
}

function getVideoIdForHoverOverlay(overlay) {
  let cardRoot = overlay.closest(videoCardRootSelector);
  if (!cardRoot) return null;

  let link = cardRoot.querySelector(videoLinkSelector);
  let href = link?.getAttribute('href');
  if (!href) return null;

  try {
    let url = new URL(href, location.href);
    if (url.pathname === '/watch') {
      return url.searchParams.get('v');
    }
    if (url.pathname.startsWith('/shorts/')) {
      return url.pathname.split('/')[2] || null;
    }
  } catch {
    return null;
  }
  return null;
}

function getVideoIdForThumbnailViewModel(thumbnail) {
  let href = getVideoHrefForThumbnailViewModel(thumbnail);
  if (!href) return null;

  try {
    let url = new URL(href, location.href);
    if (url.pathname === '/watch') {
      return url.searchParams.get('v');
    }
    if (url.pathname.startsWith('/shorts/')) {
      return url.pathname.split('/')[2] || null;
    }
  } catch {
    return null;
  }

  return null;
}

function getVideoHrefForThumbnailViewModel(thumbnail) {
  let cardRoot = thumbnail.closest(videoCardRootSelector);
  if (!cardRoot) return null;

  let link = cardRoot.querySelector(videoLinkSelector);
  return link?.getAttribute('href') || null;
}

function isShortsVideoHref(href) {
  if (!href) return false;
  try {
    return new URL(href, location.href).pathname.startsWith('/shorts/');
  } catch {
    return false;
  }
}

function buildHoverOverlayVideoButton(videoId) {
  return createRoundedDownloadButton(videoId, {
    title: `TA download video: ${videoId}`,
    size: 32,
    iconSize: 16,
    asButton: true,
  });
}

function ensureThumbnailHoverOverlayButtonNear(element) {
  if (!element) return;
  let origin =
    element instanceof Element ? element : element.parentElement || element.parentNode || null;
  if (!(origin instanceof Element)) return;

  let cardRoot = origin.closest(videoCardRootSelector);
  if (!cardRoot) return;

  let tryInject = () => {
    let overlay = cardRoot.querySelector('yt-thumbnail-hover-overlay-toggle-actions-view-model');
    if (!overlay) return false;
    return ensureThumbnailHoverOverlayButton(overlay);
  };

  if (tryInject()) return;
  requestAnimationFrame(() => {
    if (tryInject()) return;
    requestAnimationFrame(() => {
      tryInject();
    });
  });
}

function adjustOwner(channelContainer) {
  return (
    channelContainer.querySelector('.ytFlexibleActionsViewModelActionRow') ||
    channelContainer.querySelector('#buttons') ||
    channelContainer
  );
}

function buildChannelButton(channelContainer) {
  let channelHandle = getChannelHandle(channelContainer);
  channelContainer.taDerivedHandle = channelHandle;

  let buttonDiv = buildChannelButtonDiv();

  let channelSubButton = buildChannelSubButton(channelHandle);
  buttonDiv.appendChild(channelSubButton);
  channelContainer.taSubButton = channelSubButton;

  let spacer = buildSpacer();
  buttonDiv.appendChild(spacer);

  let channelDownloadButton = buildChannelDownloadButton();
  buttonDiv.appendChild(channelDownloadButton);
  channelContainer.taDownloadButton = channelDownloadButton;

  if (!channelContainer.taObserver) {
    function updateButtonsIfNecessary() {
      let newHandle = getChannelHandle(channelContainer);
      if (channelContainer.taDerivedHandle === newHandle) return;
      console.log(`updating handle from ${channelContainer.taDerivedHandle} to ${newHandle}`);
      channelContainer.taDerivedHandle = newHandle;
      let channelSubButton = buildChannelSubButton(newHandle);
      channelContainer.taSubButton.replaceWith(channelSubButton);
      channelContainer.taSubButton = channelSubButton;

      let channelDownloadButton = buildChannelDownloadButton();
      channelContainer.taDownloadButton.replaceWith(channelDownloadButton);
      channelContainer.taDownloadButton = channelDownloadButton;
    }
    channelContainer.taObserver = new MutationObserver(throttled(updateButtonsIfNecessary, 100));
    channelContainer.taObserver.observe(channelContainer, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  return buttonDiv;
}

function getChannelHandle(channelContainer) {
  function findeHandleString(container) {
    let result = null;

    function recursiveTraversal(element) {
      for (let child of element.children) {
        if (child.tagName === 'A' && child.hasAttribute('href')) {
          const href = child.getAttribute('href');
          const match = href.match(/\/@[^/]+/); // Match the path starting with "@"
          if (match) {
            // handle is in channel link
            result = match[0].substring(1);
            return;
          }
        }

        if (child.children.length === 0 && child.textContent.trim().startsWith('@')) {
          // handle is in channel description text
          result = child.textContent.trim();
          return;
        }

        recursiveTraversal(child);
        if (result) return;
      }
    }

    recursiveTraversal(container);
    return result;
  }

  let channelHandle = findeHandleString(channelContainer.parentElement);

  return channelHandle;
}

function buildChannelButtonDiv() {
  let buttonDiv = document.createElement('div');
  buttonDiv.classList.add('ta-channel-button');
  let isWatchPage = window.location.pathname.startsWith('/watch');
  Object.assign(buttonDiv.style, {
    display: 'inline-flex',
    alignItems: 'stretch',
    backgroundColor: taButtonDefaultBackground,
    border: `1px solid ${taButtonBorder}`,
    boxShadow: 'none',
    color: taButtonDefaultForeground,
    fontSize: '14px',
    padding: '0',
    borderRadius: '9999px',
    marginLeft: isWatchPage ? '8px' : '0',
    overflow: 'hidden',
  });
  return buttonDiv;
}

function buildChannelSubButton(channelHandle) {
  let channelSubButton = document.createElement('span');
  channelSubButton.innerText = 'Checking...';
  channelSubButton.title = `TA Subscribe: ${channelHandle}`;
  channelSubButton.setAttribute('data-id', channelHandle);
  channelSubButton.setAttribute('data-type', 'channel');

  channelSubButton.addEventListener('click', e => {
    e.preventDefault();
    if (channelSubButton.innerText === 'Subscribe') {
      console.log(`subscribe to: ${channelHandle}`);
      sendUrl(channelHandle, 'subscribe', channelSubButton);
    } else if (channelSubButton.innerText === 'Unsubscribe') {
      console.log(`unsubscribe from: ${channelHandle}`);
      sendUrl(channelHandle, 'unsubscribe', channelSubButton);
    } else {
      console.log('Unknown state');
    }
    e.stopPropagation();
  });
  Object.assign(channelSubButton.style, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '86px',
    height: '34px',
    padding: '0 12px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  });
  attachSegmentHoverStyle(channelSubButton);
  checkChannelSubscribed(channelSubButton);

  return channelSubButton;
}

function checkChannelSubscribed(channelSubButton) {
  function handleResponse(message) {
    if (!message || (typeof message === 'object' && message.channel_subscribed === false)) {
      channelSubButton.innerText = 'Subscribe';
    } else if (typeof message === 'object' && message.channel_subscribed === true) {
      channelSubButton.innerText = 'Unsubscribe';
    } else {
      console.log('Unknown state');
    }
  }
  function handleError(e) {
    buttonError(channelSubButton);
    channelSubButton.innerText = 'Error';
    console.error('error', e);
  }

  let channelHandle = channelSubButton.dataset.id;
  let message = { type: 'getChannel', channelHandle };
  let sending = sendMessage(message);
  sending.then(handleResponse, handleError);
}

function buildSpacer() {
  let spacer = document.createElement('span');
  spacer.setAttribute('aria-hidden', 'true');
  Object.assign(spacer.style, {
    alignSelf: 'stretch',
    width: '1px',
    backgroundColor: taButtonDivider,
  });

  return spacer;
}

function buildChannelDownloadButton() {
  let channelDownloadButton = document.createElement('span');
  channelDownloadButton.classList.add('ta-channel-download-segment');
  let currentLocation = window.location.href;
  let urlObj = new URL(currentLocation);

  if (urlObj.pathname.startsWith('/watch')) {
    let params = new URLSearchParams(document.location.search);
    let videoId = params.get('v');
    channelDownloadButton.setAttribute('data-type', 'video');
    channelDownloadButton.setAttribute('data-id', videoId);
    channelDownloadButton.title = `TA download video: ${videoId}`;
  } else {
    channelDownloadButton.setAttribute('data-id', currentLocation);
    channelDownloadButton.setAttribute('data-type', 'channel');
    channelDownloadButton.title = `TA download channel ${currentLocation}`;
  }
  channelDownloadButton.innerHTML = downloadIcon;
  styleChannelDownloadSegmentIcon(channelDownloadButton);
  channelDownloadButton.addEventListener('click', e => {
    e.preventDefault();
    console.log(`download: ${currentLocation}`);
    sendDownload(channelDownloadButton);
    e.stopPropagation();
  });
  Object.assign(channelDownloadButton.style, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '34px',
    padding: '0',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  });
  attachSegmentHoverStyle(channelDownloadButton);
  if (channelDownloadButton.dataset.type === 'video') {
    checkVideoExists(channelDownloadButton);
  }

  return channelDownloadButton;
}

function getTitleContainers() {
  let elements = document.querySelectorAll(titleContainerSelector);
  let videoNodes = [];
  let seen = new Set();
  elements.forEach(element => {
    if (!isElementVisible(element)) return;
    if (!getVideoCardRoot(element)) return;

    let videoId = getVideoId(element);
    if (!videoId || seen.has(videoId)) return;

    element.taVideoId = videoId;
    seen.add(videoId);
    videoNodes.push(element);
  });
  return videoNodes;
}

function getVideoId(titleContainer) {
  return getVideoInfo(titleContainer)?.videoId;
}

function getVideoHref(titleContainer) {
  return getVideoInfo(titleContainer)?.href || null;
}

function getVideoInfo(titleContainer) {
  if (!titleContainer) return null;
  if (titleContainer.taVideoInfo) return titleContainer.taVideoInfo;

  let href = getNearestLink(titleContainer);
  if (!href) return null;

  try {
    let url = new URL(href, location.href);
    let videoId;
    if (url.pathname === '/watch') {
      videoId = url.searchParams.get('v') || undefined;
    } else if (url.pathname.startsWith('/shorts/')) {
      videoId = url.pathname.split('/')[2] || undefined;
    }
    if (!videoId) return null;

    titleContainer.taVideoInfo = {
      href,
      isShorts: url.pathname.startsWith('/shorts/'),
      videoId,
    };
    return titleContainer.taVideoInfo;
  } catch {
    // not a valid URL
  }
  return null;
}

function getVideoCardRoot(titleContainer) {
  if (!titleContainer) return null;
  if (titleContainer.taCardRoot) return titleContainer.taCardRoot;

  let cardRoot = titleContainer.closest(videoCardRootSelector);
  if (cardRoot) {
    titleContainer.taCardRoot = cardRoot;
  }
  return cardRoot;
}

function isShortsCardTitle(titleContainer) {
  return Boolean(getVideoInfo(titleContainer)?.isShorts);
}

function getVideoButtonPlacement(titleContainer) {
  let playlistRenderer = titleContainer.closest('ytd-playlist-video-renderer');
  if (playlistRenderer) {
    let menuContainer = playlistRenderer.querySelector('#menu');
    if (menuContainer) {
      return {
        container: menuContainer,
        variant: 'playlist-menu-below',
      };
    }
  }

  let hoverActionsContainer = getThumbnailHoverActionsContainer(titleContainer);
  if (hoverActionsContainer) {
    return {
      container: hoverActionsContainer,
      variant: 'thumbnail-hover-actions',
    };
  }

  if (titleContainer.classList.contains('ytLockupMetadataViewModelTitle')) {
    let container = titleContainer.closest('yt-lockup-metadata-view-model');
    if (!container) return null;

    let host = container.closest('.ytLockupViewModelHost');
    let isHorizontalLockup = host?.classList?.contains('ytLockupViewModelHorizontal');
    if (isHorizontalLockup && container.classList.contains('ytLockupMetadataViewModelCompact')) {
      return {
        container,
        variant: 'lockup-menu-below',
      };
    }

    if (
      container.classList.contains('ytLockupMetadataViewModelCompact') ||
      container.classList.contains('ytLockupMetadataViewModelRichGridLegacyTypography')
    ) {
      return null;
    }
    if (isHorizontalLockup) {
      return null;
    }
    return {
      container,
      insertBefore: container.querySelector('.ytLockupMetadataViewModelMenuButton'),
      variant: 'lockup',
    };
  }

  if (isShortsCardTitle(titleContainer)) {
    let container = getVideoCardRoot(titleContainer);
    if (!container) return null;
    return { container, variant: 'shorts-grid' };
  }

  let container = getTitleOverlayContainer(titleContainer);
  if (!container) return null;
  return { container, variant: 'default' };
}

function getThumbnailHoverActionsContainer(titleContainer) {
  let cardRoot = getVideoCardRoot(titleContainer);
  if (!cardRoot) return null;
  return cardRoot.querySelector('yt-thumbnail-hover-overlay-toggle-actions-view-model');
}

function isUpcomingVideoCard(titleContainer) {
  const cardRoot = getVideoCardRoot(titleContainer);
  if (!cardRoot) return false;

  // Unreleased premieres/upcoming videos expose a reminder toggle attachment.
  return Boolean(
    cardRoot.querySelector(
      'lockup-attachments-view-model yt-flexible-actions-view-model toggle-button-view-model'
    )
  );
}

function createRoundedDownloadButton(videoId, options = {}) {
  let {
    title = `TA download video: ${videoId}`,
    size = 32,
    iconSize = 16,
    ghostReveal = false,
    asButton = false,
  } = options;

  let dlButton = document.createElement(asButton ? 'button' : 'a');
  dlButton.classList.add('ta-button', 'ta-hover-action');
  if (ghostReveal) {
    dlButton.classList.add('ta-hover-reveal');
  }
  if (asButton) {
    dlButton.type = 'button';
  } else {
    dlButton.href = '#';
  }
  dlButton.setAttribute('data-id', videoId);
  dlButton.setAttribute('data-type', 'video');
  dlButton.title = title;

  Object.assign(dlButton.style, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    boxSizing: 'border-box',
    appearance: 'none',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '9999px',
    backgroundColor: taButtonDefaultBackground,
    border: `1px solid ${taButtonBorder}`,
    boxShadow: 'none',
    color: taButtonDefaultForeground,
    cursor: 'pointer',
    opacity: 1,
  });

  if (ghostReveal) {
    Object.assign(dlButton.style, {
      border: '1px solid transparent',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      opacity: 0,
      pointerEvents: 'none',
    });
  }

  let dlIcon = document.createElement('span');
  dlIcon.innerHTML = defaultIcon;
  Object.assign(dlIcon.style, {
    filter: 'invert()',
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    display: 'flex',
  });
  dlButton.appendChild(dlIcon);

  captureDownloadButtonPointerEvents(dlButton);
  attachDownloadButtonHoverStyle(dlButton);
  if (ghostReveal) {
    dlButton.style.backgroundColor = 'transparent';
    dlButton.style.borderColor = 'transparent';
  }

  dlButton.addEventListener('click', e => {
    stopYouTubeThumbnailEvent(e);
    sendDownload(dlButton);
  });

  return dlButton;
}

function buildVideoButton(titleContainer, options = {}) {
  if (isUpcomingVideoCard(titleContainer)) return null;

  let videoId = titleContainer.taVideoId || getVideoId(titleContainer);
  if (!videoId) return;
  let { variant } = options;

  const dlButton = document.createElement('a');
  dlButton.classList.add('ta-button');
  dlButton.href = '#';
  dlButton.setAttribute('data-id', videoId);
  dlButton.setAttribute('data-type', 'video');
  dlButton.title = `TA download video: ${titleContainer.innerText} [${videoId}]`;

  let usesRoundedDesign =
    variant === 'thumbnail-hover-actions' ||
    variant === 'lockup-menu-below' ||
    variant === 'playlist-menu-below';
  let roundedSize = variant === 'lockup-menu-below' || variant === 'playlist-menu-below' ? 36 : 32;
  let roundedIconSize =
    variant === 'lockup-menu-below' || variant === 'playlist-menu-below' ? 18 : 16;

  if (usesRoundedDesign) {
    let roundedButton = createRoundedDownloadButton(videoId, {
      title: `TA download video: ${titleContainer.innerText} [${videoId}]`,
      size: roundedSize,
      iconSize: roundedIconSize,
      ghostReveal: variant === 'lockup-menu-below' || variant === 'playlist-menu-below',
      asButton: variant === 'thumbnail-hover-actions',
    });
    Object.assign(roundedButton.style, videoButtonVariantStyles[variant] || {});
    return roundedButton;
  } else {
    Object.assign(dlButton.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      backgroundColor: taButtonDefaultBackground,
      border: `1px solid ${taButtonBorder}`,
      boxShadow: 'none',
      color: taButtonDefaultForeground,
      fontSize: '1.4rem',
      textDecoration: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      height: 'fit-content',
      opacity: 0,
    });
  }

  Object.assign(dlButton.style, videoButtonVariantStyles[variant] || {});

  let dlIcon = document.createElement('span');
  dlIcon.innerHTML = defaultIcon;
  Object.assign(dlIcon.style, {
    filter: 'invert()',
    width: '15px',
    height: '15px',
    padding: '7px 8px',
  });

  dlButton.appendChild(dlIcon);
  attachDownloadButtonHoverStyle(dlButton);

  dlButton.addEventListener('click', e => {
    e.preventDefault();
    sendDownload(dlButton);
    e.stopPropagation();
  });

  return dlButton;
}

function getNearestLink(element) {
  if (!element) return null;
  if (element.matches(videoLinkSelector)) {
    return element.getAttribute('href');
  }

  let closestLink = element.closest(videoLinkSelector);
  if (closestLink) {
    return closestLink.getAttribute('href');
  }

  let cardRoot = getVideoCardRoot(element);
  let cardLink = cardRoot?.querySelector(videoLinkSelector);
  if (cardLink) {
    return cardLink.getAttribute('href');
  }

  // Check siblings
  let sibling = element;
  while (sibling) {
    sibling = sibling.previousElementSibling;
    if (sibling && sibling.tagName === 'A' && sibling.getAttribute('href') !== '#') {
      return sibling.getAttribute('href');
    }
  }

  sibling = element;
  while (sibling) {
    sibling = sibling.nextElementSibling;
    if (sibling && sibling.tagName === 'A' && sibling.getAttribute('href') !== '#') {
      return sibling.getAttribute('href');
    }
  }

  // Check parent elements
  for (let i = 0; i < 5 && element && element !== document; i++) {
    if (element.tagName === 'A' && element.getAttribute('href') !== '#') {
      return element.getAttribute('href');
    }
    element = element.parentNode;
  }
  return null;
}

function getTitleOverlayContainer(titleContainer) {
  let titleWrapper = titleContainer?.closest('#title-wrapper');
  if (titleWrapper) return titleWrapper;

  let element = titleContainer;
  for (let i = 0; i < 5 && element && element !== document; i++) {
    if (element.tagName === 'H3') {
      return element;
    }
    element = element.parentNode;
  }

  let parent = titleContainer?.parentElement;
  if (parent && parent.tagName !== 'A') return parent;

  parent = titleContainer?.parentElement?.parentElement;
  if (parent && parent.tagName !== 'A') return parent;

  return null;
}

function prepareVideoButtonContainer(container, taButton) {
  if (taButton.classList.contains('ta-hover-reveal')) {
    if (!container.style.position) {
      container.style.position = 'relative';
    }
    let playlistHost = container.closest('ytd-playlist-video-renderer');
    if (playlistHost && container.id === 'menu') {
      Object.assign(container.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      });
    }
    let hoverHost = playlistHost || container;
    if (hoverHost.taHoverRevealListener) return;

    hoverHost.addEventListener('mouseenter', () => {
      taButton.style.opacity = 1;
      taButton.style.pointerEvents = 'auto';
      applyDownloadButtonDefaultStyle(taButton);
      if (!taButton.isChecked) {
        checkVideoExists(taButton);
      }
    });
    hoverHost.addEventListener('mouseleave', () => {
      taButton.style.opacity = 0;
      taButton.style.pointerEvents = 'none';
      taButton.style.backgroundColor = 'transparent';
      taButton.style.borderColor = 'transparent';
      taButton.style.boxShadow = 'none';
    });
    hoverHost.taHoverRevealListener = true;
    return;
  }

  if (taButton.classList.contains('ta-hover-action')) {
    return;
  }

  if (!container.style.position) {
    container.style.position = 'relative';
  }
  if (container.hasListener) return;

  container.classList.add('title-container');
  container.addEventListener('mouseenter', () => {
    if (!taButton.isChecked) checkVideoExists(taButton);
    taButton.style.opacity = 1;
  });

  container.addEventListener('mouseleave', () => {
    taButton.style.opacity = 0;
  });
  container.hasListener = true;
}

function checkVideoExists(taButton) {
  function applyExistsState(message) {
    if (typeof message === 'string' && message) {
      setButtonOpenState(taButton, message);
    } else {
      setButtonDefaultState(taButton);
    }
    taButton.isChecked = true;
  }
  function handleError(e) {
    buttonError(taButton);
    let videoId = taButton.dataset.id;
    console.log(`error: failed to get info from TA for video ${videoId}`);
    console.error(e);
  }

  let videoId = taButton.dataset.id;
  if (!videoId) {
    videoId = getVideoId(taButton);
    if (videoId) {
      taButton.setAttribute('data-id', videoId);
      taButton.setAttribute('data-type', 'video');
      taButton.title = `TA download video: ${taButton.parentElement.innerText} [${videoId}]`;
    }
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
    videoExistsInflight
      .get(videoId)
      .then(applyExistsState, handleError);
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

function getShortsContainer() {
  if (!window.location.pathname.startsWith('/shorts/')) return null;
  return document.querySelector('reel-action-bar-view-model');
}

function buildShortsButton() {
  let videoId = window.location.pathname.split('/')[2];
  if (!videoId) return null;

  let wrapper = document.createElement('div');
  wrapper.classList.add('ta-shorts-button');
  Object.assign(wrapper.style, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '4px',
  });

  let btn = document.createElement('button');
  btn.setAttribute('data-id', videoId);
  btn.setAttribute('data-type', 'video');
  btn.title = `TA download: ${videoId}`;
  btn.classList.add('ta-hover-action');
  Object.assign(btn.style, {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    boxSizing: 'border-box',
    border: `1px solid ${taButtonBorder}`,
    backgroundColor: taButtonDefaultBackground,
    boxShadow: 'none',
    color: taButtonDefaultForeground,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  let iconSpan = document.createElement('span');
  iconSpan.innerHTML = downloadIcon;
  Object.assign(iconSpan.style, {
    filter: 'invert()',
    width: '24px',
    height: '24px',
    display: 'flex',
  });
  btn.appendChild(iconSpan);

  attachDownloadButtonHoverStyle(btn);

  btn.addEventListener('click', e => {
    e.preventDefault();
    sendDownload(btn);
    e.stopPropagation();
  });

  let label = document.createElement('div');
  label.innerText = 'TA';
  label.style.setProperty('color', 'white', 'important');
  label.style.fontSize = '12px';
  label.style.fontWeight = '500';

  wrapper.appendChild(btn);
  wrapper.appendChild(label);

  return { wrapper, btn };
}

function sendDownload(button) {
  if (button.dataset.taState === 'open' && button.dataset.openUrl) {
    let win = window.open(button.dataset.openUrl, '_blank');
    win?.focus?.();
    return;
  }
  let url = button.dataset.id;
  if (!url) return;
  sendUrl(url, 'download', button);
}

function buttonError(button) {
  let buttonSpan = button.querySelector('span');
  if (buttonSpan === null) {
    buttonSpan = button;
  }
  buttonSpan.style.filter =
    'invert(19%) sepia(93%) saturate(7472%) hue-rotate(359deg) brightness(105%) contrast(113%)';
  buttonSpan.style.color = 'red';

  button.style.opacity = 1;
  button.addEventListener('mouseout', () => {
    Object.assign(button.style, {
      opacity: 1,
    });
  });
}

function buttonSuccess(button) {
  let buttonSpan = button.querySelector('span');
  if (buttonSpan === null) {
    buttonSpan = button;
  }
  if (buttonSpan.innerHTML === 'Subscribe') {
    buttonSpan.innerHTML = 'Success';
    setTimeout(() => {
      buttonSpan.innerHTML = 'Unsubscribe';
    }, 2000);
  } else {
    setButtonQueuedState(button);
  }
}

function setButtonDefaultState(button) {
  let buttonSpan = button.querySelector('span') || button;
  buttonSpan.innerHTML = downloadIcon;
  styleChannelDownloadSegmentIcon(button);
  buttonSpan.title = 'Queue download';
  button.dataset.taState = 'download';
  delete button.dataset.openUrl;
}

function setButtonQueuedState(button) {
  let buttonSpan = button.querySelector('span') || button;
  buttonSpan.innerHTML = queuedIcon;
  styleChannelDownloadSegmentIcon(button);
  buttonSpan.title = 'Queued';
  button.dataset.taState = 'queued';
  delete button.dataset.openUrl;
}

function setButtonOpenState(button, openUrl) {
  let buttonSpan = button.querySelector('span') || button;
  buttonSpan.innerHTML = checkmarkIcon;
  styleChannelDownloadSegmentIcon(button);
  buttonSpan.title = 'Open in TA';
  button.dataset.taState = 'open';
  button.dataset.openUrl = openUrl;
}

function sendUrl(url, action, button) {
  function handleResponse(message) {
    console.log('sendUrl response: ' + JSON.stringify(message));
    if (!message || (typeof message === 'object' && message.detail === 'Invalid token.')) {
      buttonError(button);
    } else {
      buttonSuccess(button);
    }
  }

  function handleError(e) {
    console.log('error', e);
    buttonError(button);
  }

  let message = { type: action, url };

  console.log('youtube link: ' + JSON.stringify(message));

  let sending = sendMessage(message);
  sending.then(handleResponse, handleError);
}

async function sendMessage(message) {
  let response;
  try {
    response = await browserType.runtime.sendMessage(message);
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

function cleanButtons() {
  console.log('trigger clean buttons');
  document.querySelectorAll('.ta-button').forEach(button => {
    button.parentElement.hasTA = false;
    button.remove();
  });
  document.querySelectorAll('.ta-channel-button').forEach(button => {
    button.parentElement.hasTA = false;
    button.remove();
  });
  document.querySelectorAll('.ta-shorts-button').forEach(button => {
    if (button.parentElement) button.parentElement.hasTA = false;
    button.remove();
  });
}

let oldHref = document.location.href;
let navigationRefreshTimer = null;

function throttled(callback, time) {
  let throttleBlock = false;
  let lastArgs;
  return (...args) => {
    lastArgs = args;
    if (throttleBlock) return;
    throttleBlock = true;
    setTimeout(() => {
      throttleBlock = false;
      callback(...lastArgs);
    }, time);
  };
}

const handleLikeButtonClick = throttled(() => {
  window.setTimeout(trackLikedVideoState, 50);
  window.setTimeout(trackLikedVideoState, 250);
}, 200);

function handleHoverOverlayPointer(event) {
  ensureThumbnailHoverOverlayButtonNear(event.target);
}

let observer = new MutationObserver(list => {
  const currentHref = document.location.href;
  if (currentHref !== oldHref) {
    scheduleNavigationRefresh();
  }
  if (list.some(i => i.type === 'childList' && i.addedNodes.length > 0)) {
    ensureTALinks();
    attachWatchProgressListeners();
    trackLikedVideoState();
  }
});

observer.observe(document.body, { attributes: false, childList: true, subtree: true });

function scheduleNavigationRefresh(delay = 0) {
  if (navigationRefreshTimer) {
    window.clearTimeout(navigationRefreshTimer);
  }
  navigationRefreshTimer = window.setTimeout(() => {
    navigationRefreshTimer = null;
    handleHistoryNavigationRefresh();
  }, delay);
}

function handleHistoryNavigationRefresh() {
  const currentHref = document.location.href;
  if (currentHref === oldHref) {
    ensureTALinks();
    return;
  }
  cleanButtons();
  oldHref = currentHref;
  resetWatchProgressState(getCurrentPlaybackVideoId());
  resetLikeQueueState(getCurrentPlaybackVideoId());
  ensureTALinks();
  attachWatchProgressListeners();
  trackLikedVideoState();
}

window.addEventListener('popstate', () => {
  scheduleNavigationRefresh();
});

window.addEventListener('pageshow', event => {
  if (event.persisted) {
    scheduleNavigationRefresh();
  }
});

document.addEventListener('yt-navigate-finish', () => {
  scheduleNavigationRefresh();
});

document.addEventListener(
  'click',
  event => {
    let button = event.target?.closest?.('button');
    if (!button || !isLikeButton(button)) return;
    handleLikeButtonClick();
  },
  true
);
document.addEventListener('pointerenter', handleHoverOverlayPointer, true);

browserType.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return;

  if (changes.watchAutoQueue) {
    watchAutoQueueEnabled = changes.watchAutoQueue.newValue?.checked === true;
    if (!watchAutoQueueEnabled) {
      resetWatchProgressState(getCurrentPlaybackVideoId());
      detachWatchProgressListeners();
    } else {
      attachWatchProgressListeners();
      trackWatchProgress();
    }
  }

  if (changes.likeAutoQueue) {
    likeAutoQueueEnabled = changes.likeAutoQueue.newValue?.checked === true;
    if (!likeAutoQueueEnabled) {
      resetLikeQueueState(getCurrentPlaybackVideoId());
    } else {
      trackLikedVideoState();
    }
  }
});

Promise.all([loadWatchAutoQueuePreference(), loadLikeAutoQueuePreference()]).then(() => {
  logWatchProgress('preferences loaded', {
    watchAutoQueueEnabled,
    likeAutoQueueEnabled,
  });
  resetWatchProgressState(getCurrentPlaybackVideoId());
  resetLikeQueueState(getCurrentPlaybackVideoId());
  attachWatchProgressListeners();
  window.setInterval(trackWatchProgress, watchAutoQueuePollMs);
  window.setInterval(trackLikedVideoState, watchAutoQueuePollMs);
});
