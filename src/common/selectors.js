'use strict';

export const shortsLinkSelector = 'a[href^="/shorts/"], a[href*="youtube.com/shorts/"]';

export const shortsVideoContainerSelector = [
  'ytd-reel-video-renderer',
  'ytd-reel-player-overlay-renderer',
  'reel-action-bar-view-model',
  'ytd-shorts',
  'ytd-player',
].join(', ');

export const titleContainerSelector = [
  '#video-title',
  'a.ytLockupMetadataViewModelTitle',
  'h3 a[href*="/watch"]',
  'h3 a[href*="/shorts"]',
  'h4 a[href*="/watch"]',
  'h4 a[href*="/shorts"]',
  'a[href^="/shorts/"]',
].join(', ');

export const videoCardRootSelector = [
  'yt-lockup-view-model',
  'yt-lockup-metadata-view-model',
  'ytd-rich-grid-media',
  'ytd-rich-item-renderer',
  'ytd-video-renderer',
  'ytd-compact-video-renderer',
  'ytd-grid-video-renderer',
  'ytd-playlist-video-renderer',
].join(', ');

export const videoLinkSelector = [
  'a[href^="/watch"]',
  'a[href^="/shorts/"]',
  'a[href*="youtube.com/watch"]',
  'a[href*="youtube.com/shorts/"]',
].join(', ');
