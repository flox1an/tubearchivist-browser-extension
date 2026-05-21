'use strict';

import { downloadIcon, checkmarkIcon, queuedIcon } from '../common/icons.js';
import { sendMessage, checkVideoExists, t } from './api.js';

export function getDownloadButtonIconElement(button) {
  return button.querySelector('span');
}

export function stopYouTubeThumbnailEvent(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation?.();
}

export function captureDownloadButtonPointerEvents(element) {
  ['pointerdown', 'mousedown', 'mouseup', 'touchstart', 'touchend'].forEach(eventName => {
    element.addEventListener(eventName, stopYouTubeThumbnailEvent, true);
  });
}

export function createRoundedDownloadButton(videoId, options = {}) {
  let {
    title = `${t('download_video', 'TA download video')}: ${videoId}`,
    size = 32,
    iconSize = 16,
    ghostReveal = false,
    asButton = false,
  } = options;

  let dlButton = document.createElement(asButton ? 'button' : 'a');
  dlButton.classList.add('ta-button', 'ta-button-rounded', 'ta-hover-action');
  if (ghostReveal) {
    dlButton.classList.add('ta-button-ghost-reveal');
  }
  if (asButton) {
    dlButton.type = 'button';
  } else {
    dlButton.href = '#';
  }
  dlButton.setAttribute('data-id', videoId);
  dlButton.setAttribute('data-type', 'video');
  dlButton.title = title;

  dlButton.style.width = `${size}px`;
  dlButton.style.height = `${size}px`;

  let dlIcon = document.createElement('span');
  dlIcon.innerHTML = downloadIcon;
  dlIcon.style.width = `${iconSize}px`;
  dlIcon.style.height = `${iconSize}px`;
  dlButton.appendChild(dlIcon);

  dlButton.addEventListener('click', e => {
    e.preventDefault();
    sendDownload(dlButton);
    e.stopPropagation();
  });

  captureDownloadButtonPointerEvents(dlButton);
  return dlButton;
}

export function buildVideoButton(videoId, titleContainer, variant = 'default') {
  let usesRoundedDesign =
    variant === 'thumbnail-hover-actions' ||
    variant === 'lockup-menu-below' ||
    variant === 'playlist-menu-below' ||
    variant === 'shorts-grid';
  let roundedSize = variant === 'lockup-menu-below' || variant === 'playlist-menu-below' ? 36 : 32;
  let roundedIconSize =
    variant === 'lockup-menu-below' || variant === 'playlist-menu-below' ? 18 : 16;

  if (usesRoundedDesign) {
    let roundedButton = createRoundedDownloadButton(videoId, {
      title: `${t('download_video', 'TA download video')}: ${
        titleContainer.innerText
      } [${videoId}]`,
      size: roundedSize,
      iconSize: roundedIconSize,
      ghostReveal:
        variant === 'lockup-menu-below' ||
        variant === 'playlist-menu-below' ||
        variant === 'shorts-grid',
      asButton: variant === 'thumbnail-hover-actions' || variant === 'shorts-grid',
    });
    roundedButton.classList.add(`ta-variant-${variant}`);
    return roundedButton;
  }

  let dlButton = document.createElement('a');
  dlButton.classList.add('ta-button', 'ta-button-rect', `ta-variant-${variant}`);
  dlButton.href = '#';
  dlButton.setAttribute('data-id', videoId);
  dlButton.setAttribute('data-type', 'video');
  dlButton.title = `${t('download_video', 'TA download video')}: ${
    titleContainer.innerText
  } [${videoId}]`;

  let dlIcon = document.createElement('span');
  dlIcon.innerHTML = downloadIcon;
  dlIcon.style.width = '16px';
  dlIcon.style.height = '16px';
  dlButton.appendChild(dlIcon);

  dlButton.addEventListener('click', e => {
    e.preventDefault();
    sendDownload(dlButton);
    e.stopPropagation();
  });

  // Variable padding/styling for rectangular buttons
  captureDownloadButtonPointerEvents(dlButton);
  return dlButton;
}

export function styleChannelDownloadSegmentIcon(button) {
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
}

export function setButtonDefaultState(button) {
  let buttonSpan = button.querySelector('span') || button;
  buttonSpan.innerHTML = downloadIcon;
  styleChannelDownloadSegmentIcon(button);
  buttonSpan.title = t('queue_download', 'Queue download');
  button.dataset.taState = 'download';
  delete button.dataset.openUrl;
}

export function setButtonQueuedState(button) {
  let buttonSpan = button.querySelector('span') || button;
  buttonSpan.innerHTML = queuedIcon;
  styleChannelDownloadSegmentIcon(button);
  buttonSpan.title = t('queued', 'Queued');
  button.dataset.taState = 'queued';
  delete button.dataset.openUrl;
}

export function setButtonOpenState(button, openUrl) {
  let buttonSpan = button.querySelector('span') || button;
  buttonSpan.innerHTML = checkmarkIcon;
  styleChannelDownloadSegmentIcon(button);
  buttonSpan.title = t('open_in_ta', 'Open in TA');
  button.dataset.taState = 'open';
  button.dataset.openUrl = openUrl;
}

export function buttonError(button) {
  button.dataset.taState = 'error';
}

export function buttonSuccess(button) {
  let buttonSpan = button.querySelector('span');
  if (buttonSpan === null) {
    buttonSpan = button;
  }
  if (buttonSpan.innerHTML === 'Subscribe') {
    buttonSpan.innerHTML = t('success', 'Success');
    setTimeout(() => {
      buttonSpan.innerHTML = t('unsubscribe', 'Unsubscribe');
    }, 2000);
  } else if (buttonSpan.innerHTML === 'Unsubscribe') {
    buttonSpan.innerHTML = t('success', 'Success');
    setTimeout(() => {
      buttonSpan.innerHTML = t('subscribe', 'Subscribe');
    }, 2000);
  } else {
    setButtonOpenState(button, button.dataset.openUrl);
  }
}

export function sendUrl(url, action, button) {
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

export function sendDownload(button) {
  if (button.dataset.taState === 'open' && button.dataset.openUrl) {
    let win = window.open(button.dataset.openUrl, '_blank');
    win?.focus?.();
    return;
  }
  let url = button.dataset.id;
  if (!url) return;
  sendUrl(url, 'download', button);
}

export function checkChannelSubscribed(channelSubButton) {
  function handleResponse(message) {
    if (!message || (typeof message === 'object' && message.channel_subscribed === false)) {
      channelSubButton.innerText = t('subscribe', 'Subscribe');
    } else if (typeof message === 'object' && message.channel_subscribed === true) {
      channelSubButton.innerText = t('unsubscribe', 'Unsubscribe');
    } else {
      console.log('Unknown state');
    }
  }
  function handleError(e) {
    buttonError(channelSubButton);
    channelSubButton.innerText = t('error', 'Error');
    console.error('error', e);
  }

  let channelHandle = channelSubButton.dataset.id;
  let message = { type: 'getChannel', channelHandle };
  let sending = sendMessage(message);
  sending.then(handleResponse, handleError);
}

export function buildSpacer() {
  let spacer = document.createElement('span');
  spacer.setAttribute('aria-hidden', 'true');
  spacer.classList.add('ta-channel-button-spacer');
  return spacer;
}

export function buildChannelSubButton(channelHandle) {
  let channelSubButton = document.createElement('span');
  channelSubButton.classList.add('ta-channel-sub-button');
  channelSubButton.innerText = t('checking', 'Checking...');
  channelSubButton.title = `${t('subscribe_to', 'TA Subscribe')}: ${channelHandle}`;
  channelSubButton.setAttribute('data-id', channelHandle);
  channelSubButton.setAttribute('data-type', 'channel');

  channelSubButton.addEventListener('click', e => {
    e.preventDefault();
    if (channelSubButton.innerText === t('subscribe', 'Subscribe')) {
      console.log(`subscribe to: ${channelHandle}`);
      sendUrl(channelHandle, 'subscribe', channelSubButton);
    } else if (channelSubButton.innerText === t('unsubscribe', 'Unsubscribe')) {
      console.log(`unsubscribe from: ${channelHandle}`);
      sendUrl(channelHandle, 'unsubscribe', channelSubButton);
    } else {
      console.log('Unknown state');
    }
    e.stopPropagation();
  });

  checkChannelSubscribed(channelSubButton);
  return channelSubButton;
}

export function buildChannelDownloadButton() {
  let channelDownloadButton = document.createElement('span');
  channelDownloadButton.classList.add('ta-channel-download-segment', 'ta-channel-download-button');
  let currentLocation = window.location.href;
  let urlObj = new URL(currentLocation);

  if (urlObj.pathname.startsWith('/watch')) {
    let params = new URLSearchParams(document.location.search);
    let videoId = params.get('v');
    channelDownloadButton.setAttribute('data-type', 'video');
    channelDownloadButton.setAttribute('data-id', videoId);
    channelDownloadButton.title = `${t('download_video', 'TA download video')}: ${videoId}`;
  } else {
    channelDownloadButton.setAttribute('data-id', currentLocation);
    channelDownloadButton.setAttribute('data-type', 'channel');
    channelDownloadButton.title = `${t(
      'download_channel',
      'TA download channel'
    )}: ${currentLocation}`;
  }
  channelDownloadButton.innerHTML = downloadIcon;
  styleChannelDownloadSegmentIcon(channelDownloadButton);
  channelDownloadButton.addEventListener('click', e => {
    e.preventDefault();
    console.log(`download: ${currentLocation}`);
    sendDownload(channelDownloadButton);
    e.stopPropagation();
  });

  if (channelDownloadButton.dataset.type === 'video') {
    checkVideoExists(channelDownloadButton, setButtonOpenState, setButtonDefaultState, buttonError);
  }

  return channelDownloadButton;
}

export function buildChannelButtonDiv() {
  let buttonDiv = document.createElement('div');
  buttonDiv.classList.add('ta-channel-button', 'ta-channel-button-container');
  let isWatchPage = window.location.pathname.startsWith('/watch');
  if (isWatchPage) {
    buttonDiv.classList.add('ta-on-watch-page');
  }
  return buttonDiv;
}

export function buildChannelButton(channelHandle) {
  let container = buildChannelButtonDiv();
  let subBtn = buildChannelSubButton(channelHandle);
  let spacer = buildSpacer();
  let dlBtn = buildChannelDownloadButton();

  container.appendChild(subBtn);
  container.appendChild(spacer);
  container.appendChild(dlBtn);
  return container;
}
