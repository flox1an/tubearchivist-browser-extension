export function createRenderers({
  taUrlLink,
  formatDuration,
  formatPublished,
  createMetaText,
  resolveThumbnailSrc,
}) {
  function createThumb(item) {
    let thumb = document.createElement('div');
    thumb.className = 'item-thumb';

    if (!item.vid_thumb_url) return thumb;

    let image = document.createElement('img');
    image.alt = '';
    image.loading = 'lazy';
    thumb.appendChild(image);

    let fallbackSrc = item.ta_base_url
      ? new URL(item.vid_thumb_url, item.ta_base_url).href
      : item.vid_thumb_url;
    image.src = fallbackSrc;

    if (resolveThumbnailSrc) {
      resolveThumbnailSrc(item)
        .then(resolvedSrc => {
          if (resolvedSrc) {
            image.src = resolvedSrc;
          }
        })
        .catch(() => {
          // Keep fallback src when proxying fails.
        });
    }

    return thumb;
  }

  function createArchiveLink(item) {
    let link = document.createElement('a');
    if (item.youtube_id && item.ta_base_url) {
      link.href = new URL(`video/${encodeURIComponent(item.youtube_id)}`, item.ta_base_url).href;
    } else if (
      item.youtube_id &&
      taUrlLink.getAttribute('href') &&
      taUrlLink.getAttribute('href') !== '#'
    ) {
      link.href = new URL(
        `video/${encodeURIComponent(item.youtube_id)}`,
        taUrlLink.getAttribute('href')
      ).href;
    } else {
      link.href = '#';
    }
    link.target = '_blank';
    link.rel = 'noreferrer';
    return link;
  }

  function renderDownloadItem(item) {
    let link = document.createElement('a');
    link.href = item.youtube_id ? `https://www.youtube.com/watch?v=${item.youtube_id}` : '#';
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.className = 'list-item';

    let body = document.createElement('div');
    body.className = 'item-body';

    let title = document.createElement('strong');
    title.textContent = item.title || item.youtube_id || 'Untitled download';

    let meta = document.createElement('p');
    meta.textContent = createMetaText([
      item.channel_name,
      formatDuration(item.duration),
      formatPublished(item.published),
    ]);

    body.append(title, meta);
    link.append(createThumb(item), body);

    if (item.message) {
      let message = document.createElement('p');
      message.className = 'item-message';
      message.textContent = item.message;
      body.appendChild(message);
    }

    return link;
  }

  function renderArchiveItem(item) {
    let link = createArchiveLink(item);
    link.className = 'list-item archive-item';

    let body = document.createElement('div');
    body.className = 'item-body';

    let title = document.createElement('strong');
    title.textContent = item.title || 'Untitled archived video';

    let meta = document.createElement('p');
    meta.textContent = createMetaText([
      item.channel?.channel_name,
      item.vid_type,
      formatPublished(item.published),
    ]);

    body.append(title, meta);
    link.append(createThumb(item), body);

    return link;
  }

  return {
    renderDownloadItem,
    renderArchiveItem,
  };
}
