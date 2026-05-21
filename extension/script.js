"use strict";
(() => {
  // src/common/selectors.js
  var shortsLinkSelector = 'a[href^="/shorts/"], a[href*="youtube.com/shorts/"]';
  var shortsVideoContainerSelector = [
    "ytd-reel-video-renderer",
    "ytd-reel-player-overlay-renderer",
    "reel-action-bar-view-model",
    "ytd-shorts",
    "ytd-player"
  ].join(", ");
  var titleContainerSelector = [
    "#video-title",
    "a.ytLockupMetadataViewModelTitle",
    'h3 a[href*="/watch"]',
    'h3 a[href*="/shorts"]',
    'h4 a[href*="/watch"]',
    'h4 a[href*="/shorts"]',
    'a[href^="/shorts/"]'
  ].join(", ");
  var videoCardRootSelector = [
    "yt-lockup-view-model",
    "yt-lockup-metadata-view-model",
    "ytd-rich-grid-media",
    "ytd-rich-item-renderer",
    "ytd-video-renderer",
    "ytd-compact-video-renderer",
    "ytd-grid-video-renderer",
    "ytd-playlist-video-renderer"
  ].join(", ");
  var videoLinkSelector = [
    'a[href^="/watch"]',
    'a[href^="/shorts/"]',
    'a[href*="youtube.com/watch"]',
    'a[href*="youtube.com/shorts/"]'
  ].join(", ");

  // src/common/icons.js
  var downloadIcon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
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
  var checkmarkIcon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
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

  // src/content-script/api.js
  var videoExistsCache = /* @__PURE__ */ new Map();
  var videoExistsInflight = /* @__PURE__ */ new Map();
  function getBrowser() {
    if (typeof chrome !== "undefined") {
      if (typeof browser !== "undefined") {
        return browser;
      } else {
        return chrome;
      }
    } else {
      if (typeof browser !== "undefined") {
        return browser;
      }
      throw new Error("Browser API not found");
    }
  }
  var browserApi = getBrowser();
  async function sendMessage(message) {
    var _a;
    let response;
    try {
      response = await browserApi.runtime.sendMessage(message);
    } catch (e) {
      if ((_a = e == null ? void 0 : e.message) == null ? void 0 : _a.includes("Extension context invalidated"))
        return;
      throw e;
    }
    let { success, value } = response;
    if (!success) {
      throw value;
    }
    return value;
  }
  function t(key, fallbackValue) {
    if (browserApi && browserApi.i18n) {
      const msg = browserApi.i18n.getMessage(key);
      if (msg)
        return msg;
    }
    return fallbackValue;
  }
  function checkVideoExists(taButton, setButtonOpenState2, setButtonDefaultState2, buttonError2) {
    function applyExistsState(message) {
      if (typeof message === "string" && message) {
        setButtonOpenState2(taButton, message);
      } else {
        setButtonDefaultState2(taButton);
      }
      taButton.isChecked = true;
    }
    function handleError(e) {
      buttonError2(taButton);
      taButton.isChecked = true;
      let videoId2 = taButton.dataset.id;
      console.log(`error: failed to get info from TA for video ${videoId2}`);
      console.error(e);
    }
    let videoId = taButton.dataset.id;
    if (!videoId)
      return;
    if (videoExistsCache.has(videoId)) {
      let cached = videoExistsCache.get(videoId);
      if (cached === true) {
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
    let requestPromise = sendMessage({ type: "videoExists", videoId });
    videoExistsInflight.set(videoId, requestPromise);
    requestPromise.then((message) => {
      videoExistsCache.set(videoId, message);
      applyExistsState(message);
    }).catch(handleError).finally(() => {
      videoExistsInflight.delete(videoId);
    });
  }

  // src/content-script/dom-helpers.js
  function parseShortsVideoIdFromHref(href) {
    if (!href)
      return null;
    try {
      const url = new URL(href, window.location.href);
      if (!url.pathname.startsWith("/shorts/"))
        return null;
      return url.pathname.split("/")[2] || null;
    } catch {
      return null;
    }
  }
  function getElementViewportIntersectionArea(element) {
    if (!element)
      return 0;
    const rect = element.getBoundingClientRect();
    const width = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
    const height = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
    return width * height;
  }
  function getVideoIdFromShortsContext(element) {
    var _a;
    if (!element)
      return null;
    let container = element.closest(shortsVideoContainerSelector);
    while (container) {
      let directLink = container.matches(shortsLinkSelector) ? container : container.querySelector(shortsLinkSelector);
      let videoId = parseShortsVideoIdFromHref(directLink == null ? void 0 : directLink.getAttribute("href"));
      if (videoId)
        return videoId;
      container = ((_a = container.parentElement) == null ? void 0 : _a.closest(shortsVideoContainerSelector)) || null;
    }
    let nearbyLink = element.closest(shortsLinkSelector);
    return parseShortsVideoIdFromHref(nearbyLink == null ? void 0 : nearbyLink.getAttribute("href"));
  }
  function getShortsVideoIdFromViewport() {
    const points = [
      [window.innerWidth / 2, window.innerHeight / 2],
      [window.innerWidth / 2, window.innerHeight * 0.65],
      [window.innerWidth / 2, window.innerHeight * 0.35]
    ];
    for (let [x, y] of points) {
      for (let element of document.elementsFromPoint(x, y)) {
        let videoId = getVideoIdFromShortsContext(element);
        if (videoId)
          return videoId;
      }
    }
    return null;
  }
  function getShortsVideoIdFromVisibleLinks() {
    let bestCandidate = null;
    let bestArea = 0;
    for (let link of document.querySelectorAll(shortsLinkSelector)) {
      let videoId = parseShortsVideoIdFromHref(link.getAttribute("href"));
      if (!videoId)
        continue;
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
      [window.innerWidth / 2, window.innerHeight * 0.35]
    ];
    for (let [x, y] of points) {
      for (let element of document.elementsFromPoint(x, y)) {
        let container = element.closest("ytd-reel-video-renderer, ytd-reel-player-overlay-renderer");
        if (container)
          return container;
      }
    }
    return null;
  }
  function getPlaybackPlayer() {
    const players = [...document.querySelectorAll("video.html5-main-video, ytd-player video, video")];
    if (players.length <= 1)
      return players[0] || null;
    players.sort((left, right) => {
      const playingScore = Number(!right.paused) - Number(!left.paused);
      if (playingScore !== 0)
        return playingScore;
      return getElementViewportIntersectionArea(right) - getElementViewportIntersectionArea(left);
    });
    return players[0] || null;
  }
  function getCurrentPlaybackContainer() {
    let player = getPlaybackPlayer();
    if (window.location.pathname.startsWith("/shorts/")) {
      return getShortsPlaybackContainerFromViewport() || (player == null ? void 0 : player.closest("ytd-reel-video-renderer, ytd-reel-player-overlay-renderer, ytd-shorts")) || null;
    }
    return (player == null ? void 0 : player.closest("ytd-watch-flexy, ytd-player, #columns, #primary, body")) || null;
  }
  function getCurrentPlaybackVideoId() {
    if (window.location.pathname === "/watch") {
      return new URLSearchParams(window.location.search).get("v");
    }
    if (window.location.pathname.startsWith("/shorts/")) {
      let player = getPlaybackPlayer();
      let videoId = getVideoIdFromShortsContext(player) || getShortsVideoIdFromViewport() || getShortsVideoIdFromVisibleLinks();
      return videoId || window.location.pathname.split("/")[2] || null;
    }
    return null;
  }
  function isAdShowing() {
    return Boolean(document.querySelector(".html5-video-player.ad-showing"));
  }

  // src/content-script/watch-progress.js
  var watchAutoQueueRatioThreshold = 0.2;
  var watchAutoQueueMinSeconds = 60;
  var watchAutoQueueMaxSeconds = 600;
  var watchAutoQueueShortRatioThreshold = 0.8;
  var watchAutoQueueMaxDeltaSeconds = 2;
  var watchAutoQueueRetryCooldownMs = 3e4;
  var watchAutoQueueEnabled = false;
  var watchProgressState = null;
  function setWatchAutoQueueEnabled(value) {
    watchAutoQueueEnabled = value;
  }
  async function loadWatchAutoQueuePreference() {
    var _a;
    try {
      let stored = await browserApi.storage.local.get("watchAutoQueue");
      watchAutoQueueEnabled = ((_a = stored == null ? void 0 : stored.watchAutoQueue) == null ? void 0 : _a.checked) === true;
    } catch (error) {
      console.error("failed to load watch auto queue preference", error);
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
      lastLoggedBucket: -1
    };
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
    console.log("[TA auto queue]", message, metadata);
  }
  async function maybeAutoQueueVideo(videoId, state, reason) {
    if (!videoId || !state || state.queueAttemptInFlight)
      return false;
    if (Date.now() - state.lastQueueAttemptAt < watchAutoQueueRetryCooldownMs)
      return false;
    state.queueAttemptInFlight = true;
    state.lastQueueAttemptAt = Date.now();
    logWatchProgress("queue attempt starting", { videoId, reason });
    try {
      let existingVideoUrl = await sendMessage({ type: "videoExists", videoId });
      if (existingVideoUrl !== false) {
        logWatchProgress("queue skipped because video already exists in TA", { videoId, reason });
        state.queued = true;
        return true;
      }
      await sendMessage({ type: "download", url: videoId });
      logWatchProgress("queue request sent successfully", { videoId, reason });
      state.queued = true;
      return true;
    } catch (error) {
      console.error("[TA auto queue] queue request failed", { videoId, reason, error });
    } finally {
      if ((state == null ? void 0 : state.videoId) === videoId) {
        state.queueAttemptInFlight = false;
      }
    }
    return false;
  }
  async function maybeAutoQueueWatchedVideo(videoId) {
    return maybeAutoQueueVideo(videoId, watchProgressState, "watched");
  }
  function trackWatchProgress() {
    if (!watchAutoQueueEnabled)
      return;
    let videoId = getCurrentPlaybackVideoId();
    if (!videoId) {
      resetWatchProgressState();
      return;
    }
    if (!watchProgressState || watchProgressState.videoId !== videoId) {
      resetWatchProgressState(videoId);
      logWatchProgress("tracking started", { videoId, pathname: window.location.pathname });
    }
    let player = getPlaybackPlayer();
    if (!player || !Number.isFinite(player.duration) || player.duration <= 0 || isAdShowing()) {
      if (!player) {
        logWatchProgress("waiting for player element", { videoId });
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
      let elapsedSeconds = (now - lastTickAt) / 1e3;
      if (deltaSeconds > 0 && deltaSeconds <= watchAutoQueueMaxDeltaSeconds && deltaSeconds <= elapsedSeconds + 0.5) {
        watchProgressState.watchedSeconds += deltaSeconds;
      }
    }
    watchProgressState.lastCurrentTime = currentTime;
    watchProgressState.lastTickAt = now;
    if (watchProgressState.queued)
      return;
    let targetSeconds = getWatchAutoQueueTargetSeconds(duration);
    let progressBucket = Math.floor(watchProgressState.watchedSeconds / 15);
    if (progressBucket > watchProgressState.lastLoggedBucket) {
      watchProgressState.lastLoggedBucket = progressBucket;
      logWatchProgress("progress update", {
        videoId,
        watchedSeconds: Math.round(watchProgressState.watchedSeconds),
        targetSeconds: Math.round(targetSeconds),
        duration: Math.round(duration)
      });
    }
    if (watchProgressState.watchedSeconds >= targetSeconds) {
      logWatchProgress("watch threshold reached", {
        videoId,
        watchedSeconds: Math.round(watchProgressState.watchedSeconds),
        targetSeconds: Math.round(targetSeconds)
      });
      maybeAutoQueueWatchedVideo(videoId);
    }
  }

  // src/content-script/like-tracker.js
  var likeAutoQueueEnabled = false;
  var likeQueueState = null;
  function setLikeAutoQueueEnabled(value) {
    likeAutoQueueEnabled = value;
  }
  async function loadLikeAutoQueuePreference() {
    var _a;
    try {
      let stored = await browserApi.storage.local.get("likeAutoQueue");
      likeAutoQueueEnabled = ((_a = stored == null ? void 0 : stored.likeAutoQueue) == null ? void 0 : _a.checked) === true;
    } catch (error) {
      console.error("failed to load like auto queue preference", error);
    }
  }
  function resetLikeQueueState(videoId = null) {
    likeQueueState = {
      videoId,
      queued: false,
      queueAttemptInFlight: false,
      lastQueueAttemptAt: 0,
      lastLiked: false
    };
  }
  function getLikeButtons() {
    return [
      ...document.querySelectorAll(
        [
          "like-button-view-model button[aria-pressed]",
          "segmented-like-dislike-button-view-model button[aria-pressed]",
          "ytd-toggle-button-renderer button[aria-pressed]",
          "toggle-button-view-model button[aria-pressed]",
          "like-button-view-model button",
          "segmented-like-dislike-button-view-model button"
        ].join(", ")
      )
    ];
  }
  function isLikeButton(button) {
    var _a;
    if (!button)
      return false;
    let label = [
      button.getAttribute("aria-label"),
      button.getAttribute("title"),
      button.textContent,
      (_a = button.closest("[aria-label]")) == null ? void 0 : _a.getAttribute("aria-label")
    ].filter(Boolean).join(" ").toLowerCase();
    return label.includes("like") || label.includes("mag ich") || label.includes("gef\xE4llt");
  }
  function getCurrentLikeButton() {
    var _a;
    let playbackContainer = getCurrentPlaybackContainer();
    if (playbackContainer) {
      let buttonInPlaybackContainer = [...playbackContainer.querySelectorAll("button")].find(
        (button) => isLikeButton(button)
      );
      if (buttonInPlaybackContainer)
        return buttonInPlaybackContainer;
    }
    let videoId = getCurrentPlaybackVideoId();
    if (window.location.pathname.startsWith("/shorts/") && videoId) {
      let matchingShortsContainer = [...document.querySelectorAll("ytd-reel-video-renderer")].find(
        (container) => {
          let link = container.querySelector(shortsLinkSelector);
          return parseShortsVideoIdFromHref(link == null ? void 0 : link.getAttribute("href")) === videoId;
        }
      );
      let buttonInMatchingShortsContainer = [
        ...(matchingShortsContainer == null ? void 0 : matchingShortsContainer.querySelectorAll("button")) || []
      ].find((button) => isLikeButton(button));
      if (buttonInMatchingShortsContainer)
        return buttonInMatchingShortsContainer;
    }
    let visibleLikeButtons = getLikeButtons().filter((button) => isLikeButton(button)).map((button) => ({ button, area: getElementViewportIntersectionArea(button) })).filter((item) => item.area > 0).sort((left, right) => right.area - left.area);
    return ((_a = visibleLikeButtons[0]) == null ? void 0 : _a.button) || null;
  }
  function isVideoLiked(button) {
    return (button == null ? void 0 : button.getAttribute("aria-pressed")) === "true";
  }
  function trackLikedVideoState() {
    if (!likeAutoQueueEnabled)
      return;
    let videoId = getCurrentPlaybackVideoId();
    if (!videoId) {
      resetLikeQueueState();
      return;
    }
    if (!likeQueueState || likeQueueState.videoId !== videoId) {
      resetLikeQueueState(videoId);
      logWatchProgress("like tracking started", { videoId, pathname: window.location.pathname });
    }
    let likeButton = getCurrentLikeButton();
    if (!likeButton) {
      logWatchProgress("waiting for like button", { videoId });
      return;
    }
    let liked = isVideoLiked(likeButton);
    if (liked && !likeQueueState.lastLiked && !likeQueueState.queued) {
      logWatchProgress("like detected", { videoId });
      maybeAutoQueueVideo(videoId, likeQueueState, "liked");
    }
    likeQueueState.lastLiked = liked;
  }

  // src/content-script/button-factory.js
  function stopYouTubeThumbnailEvent(event) {
    var _a;
    event.preventDefault();
    event.stopPropagation();
    (_a = event.stopImmediatePropagation) == null ? void 0 : _a.call(event);
  }
  function captureDownloadButtonPointerEvents(element) {
    ["pointerdown", "mousedown", "mouseup", "touchstart", "touchend"].forEach((eventName) => {
      element.addEventListener(eventName, stopYouTubeThumbnailEvent, true);
    });
  }
  function createRoundedDownloadButton(videoId, options = {}) {
    let {
      title = `${t("download_video", "TA download video")}: ${videoId}`,
      size = 32,
      iconSize = 16,
      ghostReveal = false,
      asButton = false
    } = options;
    let dlButton = document.createElement(asButton ? "button" : "a");
    dlButton.classList.add("ta-button", "ta-button-rounded", "ta-hover-action");
    if (ghostReveal) {
      dlButton.classList.add("ta-button-ghost-reveal");
    }
    if (asButton) {
      dlButton.type = "button";
    } else {
      dlButton.href = "#";
    }
    dlButton.setAttribute("data-id", videoId);
    dlButton.setAttribute("data-type", "video");
    dlButton.title = title;
    dlButton.style.width = `${size}px`;
    dlButton.style.height = `${size}px`;
    let dlIcon = document.createElement("span");
    dlIcon.innerHTML = downloadIcon;
    dlIcon.style.width = `${iconSize}px`;
    dlIcon.style.height = `${iconSize}px`;
    dlButton.appendChild(dlIcon);
    dlButton.addEventListener("click", (e) => {
      e.preventDefault();
      sendDownload(dlButton);
      e.stopPropagation();
    });
    captureDownloadButtonPointerEvents(dlButton);
    return dlButton;
  }
  function buildVideoButton(videoId, titleContainer, variant = "default") {
    let usesRoundedDesign = variant === "thumbnail-hover-actions" || variant === "lockup-menu-below" || variant === "playlist-menu-below" || variant === "shorts-grid";
    let roundedSize = variant === "lockup-menu-below" || variant === "playlist-menu-below" ? 36 : 32;
    let roundedIconSize = variant === "lockup-menu-below" || variant === "playlist-menu-below" ? 18 : 16;
    if (usesRoundedDesign) {
      let roundedButton = createRoundedDownloadButton(videoId, {
        title: `${t("download_video", "TA download video")}: ${titleContainer.innerText} [${videoId}]`,
        size: roundedSize,
        iconSize: roundedIconSize,
        ghostReveal: variant === "lockup-menu-below" || variant === "playlist-menu-below" || variant === "shorts-grid",
        asButton: variant === "thumbnail-hover-actions" || variant === "shorts-grid"
      });
      roundedButton.classList.add(`ta-variant-${variant}`);
      return roundedButton;
    }
    let dlButton = document.createElement("a");
    dlButton.classList.add("ta-button", "ta-button-rect", `ta-variant-${variant}`);
    dlButton.href = "#";
    dlButton.setAttribute("data-id", videoId);
    dlButton.setAttribute("data-type", "video");
    dlButton.title = `${t("download_video", "TA download video")}: ${titleContainer.innerText} [${videoId}]`;
    let dlIcon = document.createElement("span");
    dlIcon.innerHTML = downloadIcon;
    dlIcon.style.width = "16px";
    dlIcon.style.height = "16px";
    dlButton.appendChild(dlIcon);
    dlButton.addEventListener("click", (e) => {
      e.preventDefault();
      sendDownload(dlButton);
      e.stopPropagation();
    });
    captureDownloadButtonPointerEvents(dlButton);
    return dlButton;
  }
  function styleChannelDownloadSegmentIcon(button) {
    if (!button.classList.contains("ta-channel-download-segment"))
      return;
    let iconWrapper = button.querySelector(".ta-channel-download-icon-wrap");
    if (!iconWrapper) {
      let icon = button.querySelector("svg");
      if (!icon)
        return;
      iconWrapper = document.createElement("span");
      iconWrapper.classList.add("ta-channel-download-icon-wrap");
      icon.replaceWith(iconWrapper);
      iconWrapper.appendChild(icon);
    }
  }
  function setButtonDefaultState(button) {
    let buttonSpan = button.querySelector("span") || button;
    buttonSpan.innerHTML = downloadIcon;
    styleChannelDownloadSegmentIcon(button);
    buttonSpan.title = t("queue_download", "Queue download");
    button.dataset.taState = "download";
    delete button.dataset.openUrl;
  }
  function setButtonOpenState(button, openUrl) {
    let buttonSpan = button.querySelector("span") || button;
    buttonSpan.innerHTML = checkmarkIcon;
    styleChannelDownloadSegmentIcon(button);
    buttonSpan.title = t("open_in_ta", "Open in TA");
    button.dataset.taState = "open";
    button.dataset.openUrl = openUrl;
  }
  function buttonError(button) {
    button.dataset.taState = "error";
  }
  function buttonSuccess(button) {
    let buttonSpan = button.querySelector("span");
    if (buttonSpan === null) {
      buttonSpan = button;
    }
    if (buttonSpan.innerHTML === "Subscribe") {
      buttonSpan.innerHTML = t("success", "Success");
      setTimeout(() => {
        buttonSpan.innerHTML = t("unsubscribe", "Unsubscribe");
      }, 2e3);
    } else if (buttonSpan.innerHTML === "Unsubscribe") {
      buttonSpan.innerHTML = t("success", "Success");
      setTimeout(() => {
        buttonSpan.innerHTML = t("subscribe", "Subscribe");
      }, 2e3);
    } else {
      setButtonOpenState(button, button.dataset.openUrl);
    }
  }
  function sendUrl(url, action, button) {
    function handleResponse(message2) {
      console.log("sendUrl response: " + JSON.stringify(message2));
      if (!message2 || typeof message2 === "object" && message2.detail === "Invalid token.") {
        buttonError(button);
      } else {
        buttonSuccess(button);
      }
    }
    function handleError(e) {
      console.log("error", e);
      buttonError(button);
    }
    let message = { type: action, url };
    console.log("youtube link: " + JSON.stringify(message));
    let sending = sendMessage(message);
    sending.then(handleResponse, handleError);
  }
  function sendDownload(button) {
    var _a;
    if (button.dataset.taState === "open" && button.dataset.openUrl) {
      let win = window.open(button.dataset.openUrl, "_blank");
      (_a = win == null ? void 0 : win.focus) == null ? void 0 : _a.call(win);
      return;
    }
    let url = button.dataset.id;
    if (!url)
      return;
    sendUrl(url, "download", button);
  }
  function checkChannelSubscribed(channelSubButton) {
    function handleResponse(message2) {
      if (!message2 || typeof message2 === "object" && message2.channel_subscribed === false) {
        channelSubButton.innerText = t("subscribe", "Subscribe");
      } else if (typeof message2 === "object" && message2.channel_subscribed === true) {
        channelSubButton.innerText = t("unsubscribe", "Unsubscribe");
      } else {
        console.log("Unknown state");
      }
    }
    function handleError(e) {
      buttonError(channelSubButton);
      channelSubButton.innerText = t("error", "Error");
      console.error("error", e);
    }
    let channelHandle = channelSubButton.dataset.id;
    let message = { type: "getChannel", channelHandle };
    let sending = sendMessage(message);
    sending.then(handleResponse, handleError);
  }
  function buildSpacer() {
    let spacer = document.createElement("span");
    spacer.setAttribute("aria-hidden", "true");
    spacer.classList.add("ta-channel-button-spacer");
    return spacer;
  }
  function buildChannelSubButton(channelHandle) {
    let channelSubButton = document.createElement("span");
    channelSubButton.classList.add("ta-channel-sub-button");
    channelSubButton.innerText = t("checking", "Checking...");
    channelSubButton.title = `${t("subscribe_to", "TA Subscribe")}: ${channelHandle}`;
    channelSubButton.setAttribute("data-id", channelHandle);
    channelSubButton.setAttribute("data-type", "channel");
    channelSubButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (channelSubButton.innerText === t("subscribe", "Subscribe")) {
        console.log(`subscribe to: ${channelHandle}`);
        sendUrl(channelHandle, "subscribe", channelSubButton);
      } else if (channelSubButton.innerText === t("unsubscribe", "Unsubscribe")) {
        console.log(`unsubscribe from: ${channelHandle}`);
        sendUrl(channelHandle, "unsubscribe", channelSubButton);
      } else {
        console.log("Unknown state");
      }
      e.stopPropagation();
    });
    checkChannelSubscribed(channelSubButton);
    return channelSubButton;
  }
  function buildChannelDownloadButton() {
    let channelDownloadButton = document.createElement("span");
    channelDownloadButton.classList.add("ta-channel-download-segment", "ta-channel-download-button");
    let currentLocation = window.location.href;
    let urlObj = new URL(currentLocation);
    if (urlObj.pathname.startsWith("/watch")) {
      let params = new URLSearchParams(document.location.search);
      let videoId = params.get("v");
      channelDownloadButton.setAttribute("data-type", "video");
      channelDownloadButton.setAttribute("data-id", videoId);
      channelDownloadButton.title = `${t("download_video", "TA download video")}: ${videoId}`;
    } else {
      channelDownloadButton.setAttribute("data-id", currentLocation);
      channelDownloadButton.setAttribute("data-type", "channel");
      channelDownloadButton.title = `${t(
        "download_channel",
        "TA download channel"
      )}: ${currentLocation}`;
    }
    channelDownloadButton.innerHTML = downloadIcon;
    styleChannelDownloadSegmentIcon(channelDownloadButton);
    channelDownloadButton.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(`download: ${currentLocation}`);
      sendDownload(channelDownloadButton);
      e.stopPropagation();
    });
    if (channelDownloadButton.dataset.type === "video") {
      checkVideoExists(channelDownloadButton, setButtonOpenState, setButtonDefaultState, buttonError);
    }
    return channelDownloadButton;
  }
  function buildChannelButtonDiv() {
    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("ta-channel-button", "ta-channel-button-container");
    let isWatchPage = window.location.pathname.startsWith("/watch");
    if (isWatchPage) {
      buttonDiv.classList.add("ta-on-watch-page");
    }
    return buttonDiv;
  }
  function buildChannelButton(channelHandle) {
    let container = buildChannelButtonDiv();
    let subBtn = buildChannelSubButton(channelHandle);
    let spacer = buildSpacer();
    let dlBtn = buildChannelDownloadButton();
    container.appendChild(subBtn);
    container.appendChild(spacer);
    container.appendChild(dlBtn);
    return container;
  }

  // src/content-script/index.js
  var injectThrottleMs = 120;
  var watchAutoQueuePollMs = 1e3;
  function throttled(callback, time) {
    let throttleBlock = false;
    let lastArgs;
    return (...args) => {
      lastArgs = args;
      if (throttleBlock)
        return;
      throttleBlock = true;
      setTimeout(() => {
        throttleBlock = false;
        callback(...lastArgs);
      }, time);
    };
  }
  function isElementVisible(element) {
    if (!element || !element.isConnected)
      return false;
    if (element.closest("template"))
      return false;
    let style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  }
  function getChannelContainers() {
    const elements = document.querySelectorAll(
      "yt-flexible-actions-view-model.ytPageHeaderViewModelFlexibleActions, #owner"
    );
    return elements;
  }
  function getTitleContainers() {
    let elements = document.querySelectorAll(titleContainerSelector);
    let videoNodes = [];
    let seenCards = /* @__PURE__ */ new Set();
    elements.forEach((element) => {
      if (!isElementVisible(element))
        return;
      let cardRoot = getVideoCardRoot(element);
      if (!cardRoot || seenCards.has(cardRoot))
        return;
      let videoId = getVideoId(element);
      if (!videoId)
        return;
      element.taVideoId = videoId;
      seenCards.add(cardRoot);
      videoNodes.push(element);
    });
    return videoNodes;
  }
  function getVideoId(titleContainer) {
    var _a;
    return (_a = getVideoInfo(titleContainer)) == null ? void 0 : _a.videoId;
  }
  function getVideoInfo(titleContainer) {
    var _a;
    if (!titleContainer)
      return null;
    let href = getNearestLink(titleContainer);
    if (!href)
      return null;
    if (((_a = titleContainer.taVideoInfo) == null ? void 0 : _a.href) === href)
      return titleContainer.taVideoInfo;
    try {
      let url = new URL(href, location.href);
      let videoId;
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") || void 0;
      } else if (url.pathname.startsWith("/shorts/")) {
        videoId = url.pathname.split("/")[2] || void 0;
      }
      if (!videoId)
        return null;
      titleContainer.taVideoInfo = {
        href,
        isShorts: url.pathname.startsWith("/shorts/"),
        videoId
      };
      titleContainer.taVideoId = videoId;
      return titleContainer.taVideoInfo;
    } catch {
    }
    return null;
  }
  function getVideoCardRoot(titleContainer) {
    if (!titleContainer)
      return null;
    if (titleContainer.taCardRoot)
      return titleContainer.taCardRoot;
    let cardRoot = titleContainer.closest(videoCardRootSelector);
    if (!cardRoot) {
      let parent = titleContainer.parentElement;
      while (parent && parent !== document.body) {
        let tag = parent.tagName.toLowerCase();
        if ((tag.includes("-renderer") || tag.includes("-view-model")) && !tag.includes("comment") && !tag.includes("post") && !tag.includes("channel") && !(tag.includes("playlist") && !tag.includes("playlist-video"))) {
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
    var _a;
    return Boolean((_a = getVideoInfo(titleContainer)) == null ? void 0 : _a.isShorts);
  }
  function getVideoButtonPlacement(titleContainer) {
    var _a, _b;
    let playlistRenderer = titleContainer.closest("ytd-playlist-video-renderer");
    if (playlistRenderer) {
      let menuContainer = playlistRenderer.querySelector("#menu");
      if (menuContainer) {
        return {
          container: menuContainer,
          variant: "playlist-menu-below"
        };
      }
    }
    let hoverActionsContainer = getThumbnailHoverActionsContainer(titleContainer);
    if (hoverActionsContainer) {
      return {
        container: hoverActionsContainer,
        variant: "thumbnail-hover-actions"
      };
    }
    let lockupContainer = titleContainer.closest(
      "yt-lock-up-metadata-view-model, yt-lockup-metadata-view-model"
    );
    if (lockupContainer) {
      let host = lockupContainer.closest(".ytLockupViewModelHost") || lockupContainer.closest('[class*="ytLockupViewModelHost"]');
      let isHorizontalLockup = ((_a = host == null ? void 0 : host.classList) == null ? void 0 : _a.contains("ytLockupViewModelHorizontal")) || ((_b = host == null ? void 0 : host.className) == null ? void 0 : _b.includes("Horizontal"));
      if (isHorizontalLockup && lockupContainer.classList.contains("ytLockupMetadataViewModelCompact")) {
        return {
          container: lockupContainer,
          variant: "lockup-menu-below"
        };
      }
      if (lockupContainer.classList.contains("ytLockupMetadataViewModelCompact")) {
        return null;
      }
      if (isHorizontalLockup) {
        return null;
      }
      return {
        container: lockupContainer,
        insertBefore: lockupContainer.querySelector('[class*="MenuButton"]') || lockupContainer.querySelector(".ytLockupMetadataViewModelMenuButton"),
        variant: "lockup"
      };
    }
    if (isShortsCardTitle(titleContainer)) {
      let container2 = getVideoCardRoot(titleContainer);
      if (!container2)
        return null;
      return { container: container2, variant: "shorts-grid" };
    }
    let container = getTitleOverlayContainer(titleContainer);
    if (!container)
      return null;
    return { container, variant: "default" };
  }
  function getThumbnailHoverActionsContainer(titleContainer) {
    let cardRoot = getVideoCardRoot(titleContainer);
    if (!cardRoot)
      return null;
    return cardRoot.querySelector("yt-thumbnail-hover-overlay-toggle-actions-view-model");
  }
  function isUpcomingVideoCard(titleContainer) {
    const cardRoot = getVideoCardRoot(titleContainer);
    if (!cardRoot)
      return false;
    return Boolean(
      cardRoot.querySelector(
        "lockup-attachments-view-model yt-flexible-actions-view-model toggle-button-view-model"
      )
    );
  }
  function getNearestLink(element) {
    if (!element)
      return null;
    if (element.matches(videoLinkSelector)) {
      return element.getAttribute("href");
    }
    let closestLink = element.closest(videoLinkSelector);
    if (closestLink) {
      return closestLink.getAttribute("href");
    }
    let cardRoot = getVideoCardRoot(element);
    let cardLink = cardRoot == null ? void 0 : cardRoot.querySelector(videoLinkSelector);
    if (cardLink) {
      return cardLink.getAttribute("href");
    }
    let sibling = element;
    while (sibling) {
      sibling = sibling.previousElementSibling;
      if (sibling && sibling.tagName === "A" && sibling.getAttribute("href") !== "#") {
        return sibling.getAttribute("href");
      }
    }
    sibling = element;
    while (sibling) {
      sibling = sibling.nextElementSibling;
      if (sibling && sibling.tagName === "A" && sibling.getAttribute("href") !== "#") {
        return sibling.getAttribute("href");
      }
    }
    for (let i = 0; i < 5 && element && element !== document; i++) {
      if (element.tagName === "A" && element.getAttribute("href") !== "#") {
        return element.getAttribute("href");
      }
      element = element.parentNode;
    }
    return null;
  }
  function getTitleOverlayContainer(titleContainer) {
    var _a;
    let titleWrapper = titleContainer == null ? void 0 : titleContainer.closest("#title-wrapper");
    if (titleWrapper)
      return titleWrapper;
    let element = titleContainer;
    for (let i = 0; i < 5 && element && element !== document; i++) {
      if (element.tagName === "H3") {
        return element;
      }
      element = element.parentNode;
    }
    let parent = titleContainer == null ? void 0 : titleContainer.parentElement;
    if (parent && parent.tagName !== "A")
      return parent;
    parent = (_a = titleContainer == null ? void 0 : titleContainer.parentElement) == null ? void 0 : _a.parentElement;
    if (parent && parent.tagName !== "A")
      return parent;
    return null;
  }
  function prepareVideoButtonContainer(container, taButton) {
    if (taButton.classList.contains("ta-button-ghost-reveal")) {
      if (!container.style.position) {
        container.style.position = "relative";
      }
      let playlistHost = container.closest("ytd-playlist-video-renderer");
      if (playlistHost && container.id === "menu") {
        Object.assign(container.style, {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        });
      }
      let hoverHost = playlistHost || container;
      if (!hoverHost.taHoverRevealListener) {
        hoverHost.addEventListener("mouseenter", () => {
          let currentBtn = hoverHost.querySelector(".ta-button");
          if (currentBtn) {
            currentBtn.classList.add("ta-visible");
            if (!currentBtn.isChecked) {
              checkVideoExists(currentBtn, setButtonOpenState, setButtonDefaultState, buttonError);
            }
          }
        });
        hoverHost.addEventListener("mouseleave", () => {
          let currentBtn = hoverHost.querySelector(".ta-button");
          if (currentBtn) {
            currentBtn.classList.remove("ta-visible");
          }
        });
        hoverHost.taHoverRevealListener = true;
      }
      return;
    }
    if (taButton.classList.contains("ta-hover-action")) {
      return;
    }
    if (!container.style.position) {
      container.style.position = "relative";
    }
    if (!container.hasListener) {
      container.classList.add("title-container");
      container.addEventListener("mouseenter", () => {
        let currentBtn = container.querySelector(".ta-button");
        if (currentBtn) {
          if (!currentBtn.isChecked) {
            checkVideoExists(currentBtn, setButtonOpenState, setButtonDefaultState, buttonError);
          }
          currentBtn.classList.add("ta-visible");
        }
      });
      container.addEventListener("mouseleave", () => {
        let currentBtn = container.querySelector(".ta-button");
        if (currentBtn) {
          currentBtn.classList.remove("ta-visible");
        }
      });
      container.hasListener = true;
    }
  }
  function findExistingVideoButton(titleContainer, placement = null) {
    var _a, _b;
    let videoId = getVideoId(titleContainer);
    if (!videoId)
      return null;
    let selector = `.ta-button[data-id="${CSS.escape(videoId)}"]`;
    return ((_a = placement == null ? void 0 : placement.container) == null ? void 0 : _a.querySelector(selector)) || ((_b = getVideoCardRoot(titleContainer)) == null ? void 0 : _b.querySelector(selector)) || null;
  }
  function ensureThumbnailHoverOverlayButtons() {
    let overlays = document.querySelectorAll("yt-thumbnail-hover-overlay-toggle-actions-view-model");
    for (let overlay of overlays) {
      ensureThumbnailHoverOverlayButton(overlay);
    }
  }
  function ensureShortsThumbnailFallbackButtons() {
    let thumbnails = document.querySelectorAll("yt-thumbnail-view-model");
    for (let thumbnail of thumbnails) {
      if (thumbnail.querySelector("yt-thumbnail-hover-overlay-toggle-actions-view-model"))
        continue;
      let videoId = getVideoIdForThumbnailViewModel(thumbnail);
      if (!videoId)
        continue;
      if (!isShortsVideoHref(getVideoHrefForThumbnailViewModel(thumbnail)))
        continue;
      let container = thumbnail.parentElement || thumbnail;
      let existingButton = container.querySelector(".ta-button");
      if (existingButton) {
        if (existingButton.dataset.id !== videoId) {
          existingButton.setAttribute("data-id", videoId);
          existingButton.title = `${t("download_video", "TA download video")}: ${videoId}`;
          existingButton.isChecked = false;
          checkVideoExists(existingButton, setButtonOpenState, setButtonDefaultState, buttonError);
        }
        continue;
      }
      let lockupHost = thumbnail.closest(".ytLockupViewModelHost");
      let hasCompactMenuPlacement = Boolean(
        lockupHost == null ? void 0 : lockupHost.querySelector(
          "yt-lockup-metadata-view-model.ytLockupMetadataViewModelCompact .ytLockupMetadataViewModelMenuButton"
        )
      );
      if (hasCompactMenuPlacement)
        continue;
      if (!container.style.position) {
        container.style.position = "relative";
      }
      let button = createRoundedDownloadButton(videoId, {
        title: `${t("download_video", "TA download video")}: ${videoId}`,
        size: 32,
        iconSize: 16,
        asButton: true
      });
      button.classList.add("ta-variant-shorts-grid");
      container.appendChild(button);
      checkVideoExists(button, setButtonOpenState, setButtonDefaultState, buttonError);
    }
  }
  function getVideoIdForHoverOverlay(overlay) {
    let cardRoot = overlay.closest(videoCardRootSelector);
    if (!cardRoot)
      return null;
    let link = cardRoot.querySelector(videoLinkSelector);
    let href = link == null ? void 0 : link.getAttribute("href");
    if (!href)
      return null;
    try {
      let url = new URL(href, location.href);
      if (url.pathname === "/watch") {
        return url.searchParams.get("v");
      }
      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/")[2] || null;
      }
    } catch {
      return null;
    }
    return null;
  }
  function getVideoIdForThumbnailViewModel(thumbnail) {
    let href = getVideoHrefForThumbnailViewModel(thumbnail);
    if (!href)
      return null;
    try {
      let url = new URL(href, location.href);
      if (url.pathname === "/watch") {
        return url.searchParams.get("v");
      }
      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/")[2] || null;
      }
    } catch {
      return null;
    }
    return null;
  }
  function getVideoHrefForThumbnailViewModel(thumbnail) {
    let cardRoot = thumbnail.closest(videoCardRootSelector);
    if (!cardRoot)
      return null;
    let link = cardRoot.querySelector(videoLinkSelector);
    return (link == null ? void 0 : link.getAttribute("href")) || null;
  }
  function isShortsVideoHref(href) {
    if (!href)
      return false;
    try {
      return new URL(href, location.href).pathname.startsWith("/shorts/");
    } catch {
      return false;
    }
  }
  function buildHoverOverlayVideoButton(videoId) {
    return createRoundedDownloadButton(videoId, {
      title: `${t("download_video", "TA download video")}: ${videoId}`,
      size: 32,
      iconSize: 16,
      asButton: true
    });
  }
  function ensureThumbnailHoverOverlayButton(overlay) {
    if (!overlay)
      return false;
    let videoId = getVideoIdForHoverOverlay(overlay);
    if (!videoId)
      return false;
    let existingButton = overlay.querySelector(".ta-button");
    if (existingButton) {
      if (existingButton.dataset.id !== videoId) {
        existingButton.setAttribute("data-id", videoId);
        existingButton.title = `${t("download_video", "TA download video")}: ${videoId}`;
        existingButton.isChecked = false;
        checkVideoExists(existingButton, setButtonOpenState, setButtonDefaultState, buttonError);
      }
      return true;
    }
    let actionRow = document.createElement("div");
    actionRow.className = "ytThumbnailHoverOverlayToggleActionsViewModelButton";
    actionRow.style.zIndex = 2018;
    actionRow.style.pointerEvents = "auto";
    ["pointerdown", "mousedown", "mouseup", "touchstart", "touchend"].forEach((eventName) => {
      actionRow.addEventListener(
        eventName,
        (e) => {
          var _a;
          e.preventDefault();
          e.stopPropagation();
          (_a = e.stopImmediatePropagation) == null ? void 0 : _a.call(e);
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
    if (!element)
      return;
    let origin = element instanceof Element ? element : element.parentElement || element.parentNode || null;
    if (!(origin instanceof Element))
      return;
    let cardRoot = origin.closest(videoCardRootSelector);
    if (!cardRoot)
      return;
    let tryInject = () => {
      let overlay = cardRoot.querySelector("yt-thumbnail-hover-overlay-toggle-actions-view-model");
      if (!overlay)
        return false;
      return ensureThumbnailHoverOverlayButton(overlay);
    };
    if (tryInject())
      return;
    requestAnimationFrame(() => {
      if (tryInject())
        return;
      requestAnimationFrame(() => {
        tryInject();
      });
    });
  }
  function adjustOwner(channelContainer) {
    return channelContainer.querySelector(".ytFlexibleActionsViewModelActionRow") || channelContainer.querySelector("#buttons") || channelContainer;
  }
  function getChannelHandle(channelContainer) {
    function findHandleString(container) {
      let result = null;
      function recursiveTraversal(element) {
        for (let child of element.children) {
          if (child.tagName === "A" && child.hasAttribute("href")) {
            const href = child.getAttribute("href");
            const match = href.match(/\/@[^/]+/);
            if (match) {
              result = match[0].substring(1);
              return;
            }
          }
          if (child.children.length === 0 && child.textContent.trim().startsWith("@")) {
            result = child.textContent.trim();
            return;
          }
          recursiveTraversal(child);
          if (result)
            return;
        }
      }
      recursiveTraversal(container);
      return result;
    }
    let channelHandle = findHandleString(channelContainer.parentElement);
    return channelHandle;
  }
  function buildShortsButton() {
    let videoId = window.location.pathname.split("/")[2];
    if (!videoId)
      return null;
    let wrapper = document.createElement("div");
    wrapper.classList.add("ta-shorts-button-wrapper");
    let btn = document.createElement("button");
    btn.setAttribute("data-id", videoId);
    btn.setAttribute("data-type", "video");
    btn.title = `${t("download_video", "TA download video")}: ${videoId}`;
    btn.classList.add("ta-shorts-button", "ta-hover-action");
    let iconSpan = document.createElement("span");
    iconSpan.innerHTML = downloadIcon;
    iconSpan.classList.add("ta-shorts-button-icon");
    btn.appendChild(iconSpan);
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      sendDownload(btn);
      e.stopPropagation();
    });
    captureDownloadButtonPointerEvents(btn);
    let label = document.createElement("div");
    label.innerText = "TA";
    label.style.setProperty("color", "white", "important");
    label.style.fontSize = "12px";
    label.style.fontWeight = "500";
    wrapper.appendChild(btn);
    wrapper.appendChild(label);
    return { wrapper, btn };
  }
  function getShortsContainer() {
    if (!window.location.pathname.startsWith("/shorts/"))
      return null;
    return document.querySelector("reel-action-bar-view-model");
  }
  function ensureTALinks() {
    ensureThumbnailHoverOverlayButtons();
    ensureShortsThumbnailFallbackButtons();
    let shortsContainer = getShortsContainer();
    if (shortsContainer) {
      if (shortsContainer.hasTA && !shortsContainer.querySelector(".ta-shorts-button")) {
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
      if (channelContainer.hasTA && !channelContainer.querySelector(".ta-channel-button")) {
        channelContainer.hasTA = false;
      }
      if (channelContainer.hasTA)
        continue;
      let channelButton = buildChannelButton(getChannelHandle(channelContainer));
      channelContainer.appendChild(channelButton);
      channelContainer.hasTA = true;
    }
    let titleContainerNodes = getTitleContainers();
    for (let titleContainer of titleContainerNodes) {
      let placement = getVideoButtonPlacement(titleContainer);
      if (!placement)
        continue;
      let videoId = getVideoId(titleContainer);
      if (!videoId)
        continue;
      if (isUpcomingVideoCard(titleContainer))
        continue;
      let existingInTarget = placement.container.querySelector(".ta-button");
      if (existingInTarget && existingInTarget.dataset.id !== videoId) {
        existingInTarget.remove();
        existingInTarget = null;
      }
      let existingButton = findExistingVideoButton(titleContainer, placement);
      if (existingInTarget)
        continue;
      if (existingButton && existingButton.parentElement === placement.container)
        continue;
      if (existingButton && existingButton.parentElement) {
        existingButton.remove();
      }
      let videoButton = buildVideoButton(videoId, titleContainer, placement.variant);
      if (videoButton == null)
        continue;
      prepareVideoButtonContainer(placement.container, videoButton);
      if (placement.insertBefore) {
        placement.container.insertBefore(videoButton, placement.insertBefore);
      } else {
        placement.container.appendChild(videoButton);
      }
    }
  }
  var ensureTALinksThrottled = throttled(ensureTALinks, injectThrottleMs);
  function cleanButtons() {
    console.log("trigger clean buttons");
    document.querySelectorAll(".ta-button").forEach((button) => {
      if (button.parentElement)
        button.parentElement.hasTA = false;
      button.remove();
    });
    document.querySelectorAll(".ta-channel-button").forEach((button) => {
      if (button.parentElement)
        button.parentElement.hasTA = false;
      button.remove();
    });
    document.querySelectorAll(".ta-shorts-button-wrapper").forEach((button) => {
      if (button.parentElement)
        button.parentElement.hasTA = false;
      button.remove();
    });
  }
  var oldHref = document.location.href;
  var navigationRefreshTimer = null;
  var handleLikeButtonClick = throttled(() => {
    window.setTimeout(trackLikedVideoState, 50);
    window.setTimeout(trackLikedVideoState, 250);
  }, 200);
  function handleHoverOverlayPointer(event) {
    ensureThumbnailHoverOverlayButtonNear(event.target);
  }
  var observer = new MutationObserver((list) => {
    const currentHref = document.location.href;
    if (currentHref !== oldHref) {
      scheduleNavigationRefresh();
    }
    if (list.some((i) => i.type === "childList" && i.addedNodes.length > 0)) {
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
  var watchProgressPlayer = null;
  function handlePlaybackEvent() {
    trackWatchProgress();
    trackLikedVideoState();
  }
  function detachWatchProgressListeners() {
    if (!watchProgressPlayer)
      return;
    watchProgressPlayer.removeEventListener("timeupdate", handlePlaybackEvent);
    watchProgressPlayer.removeEventListener("play", handlePlaybackEvent);
    watchProgressPlayer.removeEventListener("playing", handlePlaybackEvent);
    watchProgressPlayer.removeEventListener("pause", handlePlaybackEvent);
    watchProgressPlayer.removeEventListener("loadedmetadata", handlePlaybackEvent);
    watchProgressPlayer.removeEventListener("durationchange", handlePlaybackEvent);
    watchProgressPlayer.removeEventListener("seeking", handlePlaybackEvent);
    watchProgressPlayer.removeEventListener("seeked", handlePlaybackEvent);
    watchProgressPlayer = null;
  }
  function attachWatchProgressListeners() {
    let player = getPlaybackPlayer();
    if (player === watchProgressPlayer)
      return;
    detachWatchProgressListeners();
    if (!player)
      return;
    watchProgressPlayer = player;
    player.addEventListener("timeupdate", handlePlaybackEvent);
    player.addEventListener("play", handlePlaybackEvent);
    player.addEventListener("playing", handlePlaybackEvent);
    player.addEventListener("pause", handlePlaybackEvent);
    player.addEventListener("loadedmetadata", handlePlaybackEvent);
    player.addEventListener("durationchange", handlePlaybackEvent);
    player.addEventListener("seeking", handlePlaybackEvent);
    player.addEventListener("seeked", handlePlaybackEvent);
  }
  window.addEventListener("popstate", () => {
    scheduleNavigationRefresh();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      scheduleNavigationRefresh();
    }
  });
  document.addEventListener("yt-navigate-finish", () => {
    scheduleNavigationRefresh();
  });
  document.addEventListener(
    "click",
    (event) => {
      var _a, _b;
      let button = (_b = (_a = event.target) == null ? void 0 : _a.closest) == null ? void 0 : _b.call(_a, "button");
      if (!button || !isLikeButton(button))
        return;
      handleLikeButtonClick();
    },
    true
  );
  document.addEventListener("pointerenter", handleHoverOverlayPointer, true);
  browserApi.storage.onChanged.addListener((changes, areaName) => {
    var _a, _b;
    if (areaName !== "local")
      return;
    if (changes.watchAutoQueue) {
      const newVal = ((_a = changes.watchAutoQueue.newValue) == null ? void 0 : _a.checked) === true;
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
      const newVal = ((_b = changes.likeAutoQueue.newValue) == null ? void 0 : _b.checked) === true;
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
})();
