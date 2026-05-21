export function getBrowser() {
  if (typeof chrome !== 'undefined') {
    if (typeof browser !== 'undefined') {
      return browser;
    }
    return chrome;
  }

  throw new Error('browser detection error');
}

function byId(id) {
  return document.getElementById(id);
}

export const el = {
  connectionCard: byId('connection-card'),
  taUrlLink: byId('ta-url'),
  extensionVersion: byId('extension-version'),
  errorOut: byId('error-out'),
  fullUrlInput: byId('full-url'),
  apiKeyInput: byId('api-key'),
  connectionState: byId('connection-state'),
  connectionToggle: byId('connection-toggle'),
  connectionSummaryUrl: byId('connection-summary-url'),
  connectionSummaryMeta: byId('connection-summary-meta'),
  saveState: byId('save-state'),
  cookieStatus: byId('sendCookiesStatus'),
  cookieResponseTextArea: byId('cookieLinesResponse'),
  showCookiesButton: byId('showCookies'),
  continuousSyncInput: byId('continuous-sync'),
  autostartInput: byId('autostart'),
  watchAutoQueueInput: byId('watch-auto-queue'),
  likeAutoQueueInput: byId('like-auto-queue'),
  downloadsList: byId('downloads-list'),
  downloadsState: byId('downloads-state'),
  downloadsCount: byId('downloads-count'),
  downloadsSentinel: byId('downloads-sentinel'),
  archiveList: byId('archive-list'),
  archiveState: byId('archive-state'),
  archiveCount: byId('archive-count'),
  archiveSentinel: byId('archive-sentinel'),
  downloadsLink: byId('downloads-link'),
  downloadsRefresh: byId('downloads-refresh'),
  archiveHomeLink: byId('archive-home-link'),
  archiveRefresh: byId('archive-refresh'),
  archiveStats: byId('archive-stats'),
  archiveSearchToggle: byId('archive-search-toggle'),
  archiveSearchWrap: byId('archive-search-wrap'),
  archiveSearchInput: byId('archive-search-input'),
  archiveType: byId('archive-type'),
  archiveSort: byId('archive-sort'),
  archiveSearchClose: byId('archive-search-close'),
};
