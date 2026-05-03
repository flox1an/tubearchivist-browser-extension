export function formatResultCount(total, maxHits) {
  let normalizedTotal = Number(total);
  if (!Number.isFinite(normalizedTotal)) {
    return '0';
  }

  let formatted = normalizedTotal.toLocaleString();
  return maxHits ? `${formatted}+` : formatted;
}

export function formatDuration(value) {
  if (!value && value !== 0) return '';
  if (typeof value === 'string') return value;

  let seconds = Number(value);
  if (Number.isNaN(seconds)) return '';

  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = Math.floor(seconds % 60);
  let parts = hours > 0 ? [hours, minutes, remainingSeconds] : [minutes, remainingSeconds];
  return parts.map(part => part.toString().padStart(2, '0')).join(':');
}

export function formatPublished(value) {
  if (!value) return '';

  let parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function createMetaText(parts) {
  return parts.filter(Boolean).join(' · ');
}

