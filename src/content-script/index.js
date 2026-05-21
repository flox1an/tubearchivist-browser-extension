'use strict';

import {
  titleContainerSelector,
  videoCardRootSelector,
  videoLinkSelector,
} from '../common/selectors.js';
import { downloadIcon } from '../common/icons.js';
import { browserApi, checkVideoExists, t } from './api.js';
import {
  getCurrentPlaybackVideoId,
  getPlaybackPlayer,
} from './dom-helpers.js';
import {
  setWatchAutoQueueEnabled,
  loadWatchAutoQueuePreference,
  resetWatchProgressState,
  trackWatchProgress,
} from './watch-progress.js';
import {
  setLikeAutoQueueEnabled,
  loadLikeAutoQueuePreference,
  resetLikeQueueState,
  trackLikedVideoState,
  isLikeButton,
} from './like-tracker.js';
import {
  createRoundedDownloadButton,
  buildVideoButton,
  buildChannelButton,
  setButtonOpenState,
  setButtonDefaultState,
  buttonError,
  sendDownload,
  captureDownloadButtonPointerEvents,
} from './button-factory.js';

const injectThrottleMs = 120;
const watchAutoQueuePollMs = 1000;

export function throttled(callback, time) {
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

function isElementVisible(element) {
  if (!element || !element.isConnected) return false;
  if (element.closest('template')) return false;
  let style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
}

function getChannelContainers() {
  const elements = document.querySelectorAll(
    'yt-flexible-actions-view-model.ytPageHeaderViewModelFlexibleActions, #owner'
  );
  return elements;
}

function getTitleContainers() {
  let elements = document.querySelectorAll(titleContainerSelector);
  let videoNodes = [];
  let seenCards = new Set();
  elements.forEach(element => {
    if (!isElementVisible(element)) return;
    let cardRoot = getVideoCardRoot(element);
    if (!cardRoot || seenCards.has(cardRoot)) return;

    let videoId = getVideoId(element);
    if (!videoId) return;

    element.taVideoId = videoId;
    seenCards.add(cardRoot);
    videoNodes.push(element);
  });
  return videoNodes;
}

function getVideoId(titleContainer) {
  return getVideoInfo(titleContainer)?.videoId;
}

function getVideoInfo(titleContainer) {
  if (!titleContainer) return null;

  let href = getNearestLink(titleContainer);
  if (!href) return null;
  if (titleContainer.taVideoInfo?.href === href) return titleContainer.taVideoInfo;

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
    titleContainer.taVideoId = videoId;
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
  if (!cardRoot) {
    let parent = titleContainer.parentElement;
    while (parent && parent !== document.body) {
      let tag = parent.tagName.toLowerCase();
      if (
        (tag.includes('-renderer') || tag.includes('-view-model')) &&
        !tag.includes('comment') &&
        !tag.includes('post') &&
        !tag.includes('channel') &&
        !(tag.includes('playlist') && !tag.includes('playlist-video'))
      ) {
        cardRoot = parent;
        break;
      }
      parent = parent.parentElement;
    }
  }

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

  let lockupContainer = titleContainer.closest(
    'yt-lock-up-metadata-view-model, yt-lockup-metadata-view-model'
  );
  if (lockupContainer) {
    let host =
      lockupContainer.closest('.ytLockupViewModelHost') ||
      lockupContainer.closest('[class*="ytLockupViewModelHost"]');
    let isHorizontalLockup =
      host?.classList?.contains('ytLockupViewModelHorizontal') ||
      host?.className?.includes('Horizontal');
    if (
      isHorizontalLockup &&
      lockupContainer.classList.contains('ytLockupMetadataViewModelCompact')
    ) {
      return {
        container: lockupContainer,
        variant: 'lockup-menu-below',
      };
    }

    if (lockupContainer.classList.contains('ytLockupMetadataViewModelCompact')) {
      return null;
    }
    if (isHorizontalLockup) {
      return null;
    }
    return {
      container: lockupContainer,
      insertBefore:
        lockupContainer.querySelector('[class*="MenuButton"]') ||
        lockupContainer.querySelector('.ytLockupMetadataViewModelMenuButton'),
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

  return Boolean(
    cardRoot.querySelector(
      'lockup-attachments-view-model yt-flexible-actions-view-model toggle-button-view-model'
    )
  );
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
  if (taButton.classList.contains('ta-button-ghost-reveal')) {
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
    if (!hoverHost.taHoverRevealListener) {
      hoverHost.addEventListener('mouseenter', () => {
        let currentBtn = hoverHost.querySelector('.ta-button');
        if (currentBtn) {
          currentBtn.classList.add('ta-visible');
          if (!currentBtn.isChecked) {
            checkVideoExists(currentBtn, setButtonOpenState, setButtonDefaultState, buttonError);
          }
        }
      });
      hoverHost.addEventListener('mouseleave', () => {
        let currentBtn = hoverHost.querySelector('.ta-button');
        if (currentBtn) {
          currentBtn.classList.remove('ta-visible');
        }
      });
      hoverHost.taHoverRevealListener = true;
    }
    return;
  }

  if (taButton.classList.contains('ta-hover-action')) {
    return;
  }

  if (!container.style.position) {
    container.style.position = 'relative';
  }
  if (!container.hasListener) {
    container.classList.add('title-container');
    container.addEventListener('mouseenter', () => {
      let currentBtn = container.querySelector('.ta-button');
      if (currentBtn) {
        if (!currentBtn.isChecked) {
          checkVideoExists(currentBtn, setButtonOpenState, setButtonDefaultState, buttonError);
        }
        currentBtn.classList.add('ta-visible');
      }
    });

    container.addEventListener('mouseleave', () => {
      let currentBtn = container.querySelector('.ta-button');
      if (currentBtn) {
        currentBtn.classList.remove('ta-visible');
      }
    });
    container.hasListener = true;
  }
}

function findExistingVideoButton(titleContainer, placement = null) {
  let videoId = getVideoId(titleContainer);
  if (!videoId) return null;

  let selector = `.ta-button[data-id="${CSS.escape(videoId)}"]`;
  return (
    placement?.container?.querySelector(selector) ||
    getVideoCardRoot(titleContainer)?.querySelector(selector) ||
    null
  );
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

    let videoId = getVideoIdForThumbnailViewModel(thumbnail);
    if (!videoId) continue;
    if (!isShortsVideoHref(getVideoHrefForThumbnailViewModel(thumbnail))) continue;

    let container = thumbnail.parentElement || thumbnail;

    let existingButton = container.querySelector('.ta-button');
    if (existingButton) {
      if (existingButton.dataset.id !== videoId) {
        existingButton.setAttribute('data-id', videoId);
        existingButton.title = `${t('download_video', 'TA download video')}: ${videoId}`;
        existingButton.isChecked = false;
        checkVideoExists(existingButton, setButtonOpenState, setButtonDefaultState, buttonError);
      }
      continue;
    }

    let lockupHost = thumbnail.closest('.ytLockupViewModelHost');
    let hasCompactMenuPlacement = Boolean(
      lockupHost?.querySelector(
        'yt-lockup-metadata-view-model.ytLockupMetadataViewModelCompact .ytLockupMetadataViewModelMenuButton'
      )
    );
    if (hasCompactMenuPlacement) continue;

    if (!container.style.position) {
      container.style.position = 'relative';
    }

    let button = createRoundedDownloadButton(videoId, {
      title: `${t('download_video', 'TA download video')}: ${videoId}`,
      size: 32,
      iconSize: 16,
      asButton: true,
    });
    button.classList.add('ta-variant-shorts-grid');

    container.appendChild(button);
    checkVideoExists(button, setButtonOpenState, setButtonDefaultState, buttonError);
  }
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
    title: `${t('download_video', 'TA download video')}: ${videoId}`,
    size: 32,
    iconSize: 16,
    asButton: true,
  });
}

function ensureThumbnailHoverOverlayButton(overlay) {
  if (!overlay) return false;

  let videoId = getVideoIdForHoverOverlay(overlay);
  if (!videoId) return false;

  let existingButton = overlay.querySelector('.ta-button');
  if (existingButton) {
    if (existingButton.dataset.id !== videoId) {
      existingButton.setAttribute('data-id', videoId);
      existingButton.title = `${t('download_video', 'TA download video')}: ${videoId}`;
      existingButton.isChecked = false;
      checkVideoExists(existingButton, setButtonOpenState, setButtonDefaultState, buttonError);
    }
    return true;
  }

  let actionRow = document.createElement('div');
  actionRow.className = 'ytThumbnailHoverOverlayToggleActionsViewModelButton';
  actionRow.style.zIndex = 2018;
  actionRow.style.pointerEvents = 'auto';

  // Need to forward event capturing:
  ['pointerdown', 'mousedown', 'mouseup', 'touchstart', 'touchend'].forEach(eventName => {
    actionRow.addEventListener(
      eventName,
      e => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
      },
      true
    );
  });

  let taButton = buildHoverOverlayVideoButton(videoId);
  actionRow.appendChild(taButton);
  overlay.appendChild(actionRow);

  checkVideoExists(taButton, setButtonOpenState, setButtonDefaultState, buttonError);
  return true;
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

function getChannelHandle(channelContainer) {
  function findHandleString(container) {
    let result = null;

    function recursiveTraversal(element) {
      for (let child of element.children) {
        if (child.tagName === 'A' && child.hasAttribute('href')) {
          const href = child.getAttribute('href');
          const match = href.match(/\/@[^/]+/);
          if (match) {
            result = match[0].substring(1);
            return;
          }
        }

        if (child.children.length === 0 && child.textContent.trim().startsWith('@')) {
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

  let channelHandle = findHandleString(channelContainer.parentElement);
  return channelHandle;
}

function buildShortsButton() {
  let videoId = window.location.pathname.split('/')[2];
  if (!videoId) return null;

  let wrapper = document.createElement('div');
  wrapper.classList.add('ta-shorts-button-wrapper');

  let btn = document.createElement('button');
  btn.setAttribute('data-id', videoId);
  btn.setAttribute('data-type', 'video');
  btn.title = `${t('download_video', 'TA download video')}: ${videoId}`;
  btn.classList.add('ta-shorts-button', 'ta-hover-action');

  let iconSpan = document.createElement('span');
  iconSpan.innerHTML = downloadIcon;
  iconSpan.classList.add('ta-shorts-button-icon');
  btn.appendChild(iconSpan);

  btn.addEventListener('click', e => {
    e.preventDefault();
    sendDownload(btn);
    e.stopPropagation();
  });

  captureDownloadButtonPointerEvents(btn);

  let label = document.createElement('div');
  label.innerText = 'TA';
  label.style.setProperty('color', 'white', 'important');
  label.style.fontSize = '12px';
  label.style.fontWeight = '500';

  wrapper.appendChild(btn);
  wrapper.appendChild(label);

  return { wrapper, btn };
}

function getShortsContainer() {
  if (!window.location.pathname.startsWith('/shorts/')) return null;
  return document.querySelector('reel-action-bar-view-model');
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
        checkVideoExists(btn, setButtonOpenState, setButtonDefaultState, buttonError);
      }
    }
  }

  let channelContainerNodes = getChannelContainers();

  for (let channelContainer of channelContainerNodes) {
    channelContainer = adjustOwner(channelContainer);
    if (channelContainer.hasTA && !channelContainer.querySelector('.ta-channel-button')) {
      channelContainer.hasTA = false;
    }
    if (channelContainer.hasTA) continue;
    let channelButton = buildChannelButton(getChannelHandle(channelContainer));
    channelContainer.appendChild(channelButton);
    channelContainer.hasTA = true;
  }

  let titleContainerNodes = getTitleContainers();
  for (let titleContainer of titleContainerNodes) {
    let placement = getVideoButtonPlacement(titleContainer);
    if (!placement) continue;

    let videoId = getVideoId(titleContainer);
    if (!videoId) continue;
    if (isUpcomingVideoCard(titleContainer)) continue;

    let existingInTarget = placement.container.querySelector('.ta-button');
    if (existingInTarget && existingInTarget.dataset.id !== videoId) {
      existingInTarget.remove();
      existingInTarget = null;
    }

    let existingButton = findExistingVideoButton(titleContainer, placement);

    if (existingInTarget) continue;
    if (existingButton && existingButton.parentElement === placement.container) continue;

    if (existingButton && existingButton.parentElement) {
      existingButton.remove();
    }

    let videoButton = buildVideoButton(videoId, titleContainer, placement.variant);
    if (videoButton == null) continue;

    prepareVideoButtonContainer(placement.container, videoButton);
    if (placement.insertBefore) {
      placement.container.insertBefore(videoButton, placement.insertBefore);
    } else {
      placement.container.appendChild(videoButton);
    }
  }
}
const ensureTALinksThrottled = throttled(ensureTALinks, injectThrottleMs);

function cleanButtons() {
  console.log('trigger clean buttons');
  document.querySelectorAll('.ta-button').forEach(button => {
    if (button.parentElement) button.parentElement.hasTA = false;
    button.remove();
  });
  document.querySelectorAll('.ta-channel-button').forEach(button => {
    if (button.parentElement) button.parentElement.hasTA = false;
    button.remove();
  });
  document.querySelectorAll('.ta-shorts-button-wrapper').forEach(button => {
    if (button.parentElement) button.parentElement.hasTA = false;
    button.remove();
  });
}

let oldHref = document.location.href;
let navigationRefreshTimer = null;

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
    ensureTALinksThrottled();
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
    ensureTALinksThrottled();
    return;
  }
  cleanButtons();
  oldHref = currentHref;
  resetWatchProgressState(getCurrentPlaybackVideoId());
  resetLikeQueueState(getCurrentPlaybackVideoId());
  ensureTALinksThrottled();
  attachWatchProgressListeners();
  trackLikedVideoState();
}

let watchProgressPlayer = null;

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

browserApi.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return;

  if (changes.watchAutoQueue) {
    const newVal = changes.watchAutoQueue.newValue?.checked === true;
    setWatchAutoQueueEnabled(newVal);
    if (!newVal) {
      resetWatchProgressState(getCurrentPlaybackVideoId());
      detachWatchProgressListeners();
    } else {
      attachWatchProgressListeners();
      trackWatchProgress();
    }
  }

  if (changes.likeAutoQueue) {
    const newVal = changes.likeAutoQueue.newValue?.checked === true;
    setLikeAutoQueueEnabled(newVal);
    if (!newVal) {
      resetLikeQueueState(getCurrentPlaybackVideoId());
    } else {
      trackLikedVideoState();
    }
  }
});

Promise.all([loadWatchAutoQueuePreference(), loadLikeAutoQueuePreference()]).then(() => {
  resetWatchProgressState(getCurrentPlaybackVideoId());
  resetLikeQueueState(getCurrentPlaybackVideoId());
  attachWatchProgressListeners();
  window.setInterval(trackWatchProgress, watchAutoQueuePollMs);
  window.setInterval(trackLikedVideoState, watchAutoQueuePollMs);
});
