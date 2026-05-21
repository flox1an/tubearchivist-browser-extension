'use strict';

import { shortsLinkSelector, shortsVideoContainerSelector } from '../common/selectors.js';

export function parseShortsVideoIdFromHref(href) {
  if (!href) return null;
  try {
    const url = new URL(href, window.location.href);
    if (!url.pathname.startsWith('/shorts/')) return null;
    return url.pathname.split('/')[2] || null;
  } catch {
    return null;
  }
}

export function getElementViewportIntersectionArea(element) {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const width = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
  const height = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
  return width * height;
}

export function getVideoIdFromShortsContext(element) {
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

export function getShortsVideoIdFromViewport() {
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

export function getShortsVideoIdFromVisibleLinks() {
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

export function getShortsPlaybackContainerFromViewport() {
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

export function getPlaybackPlayer() {
  const players = [...document.querySelectorAll('video.html5-main-video, ytd-player video, video')];
  if (players.length <= 1) return players[0] || null;

  players.sort((left, right) => {
    const playingScore = Number(!right.paused) - Number(!left.paused);
    if (playingScore !== 0) return playingScore;

    return getElementViewportIntersectionArea(right) - getElementViewportIntersectionArea(left);
  });

  return players[0] || null;
}

export function getCurrentPlaybackContainer() {
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

export function getCurrentPlaybackVideoId() {
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

export function isAdShowing() {
  return Boolean(document.querySelector('.html5-video-player.ad-showing'));
}
