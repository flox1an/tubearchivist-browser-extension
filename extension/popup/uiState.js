export const popupUiStateKey = 'popupUiState';

export function normalizeArchiveUiState(rawState) {
  let state = rawState || {};

  let archiveSortBy =
    state.archiveSortBy === 'published' || state.archiveSortBy === 'downloaded'
      ? state.archiveSortBy
      : 'downloaded';
  let archiveSortOrderValue = state.archiveSortOrderValue === 'asc' ? 'asc' : 'desc';
  let archiveTypeValue =
    state.archiveTypeValue === 'videos' ||
    state.archiveTypeValue === 'shorts' ||
    state.archiveTypeValue === 'streams'
      ? state.archiveTypeValue
      : '';
  let archiveSearchTerm =
    typeof state.archiveSearchTerm === 'string' ? state.archiveSearchTerm.trim() : '';
  let archiveSearchVisible = state.archiveSearchVisible === true;

  return {
    archiveSortBy,
    archiveSortOrderValue,
    archiveTypeValue,
    archiveSearchTerm,
    archiveSearchVisible,
    activePanelId: state.activePanelId,
  };
}

export function toPersistedUiState({
  activePanelId,
  archiveSearchVisible,
  archiveSearchTerm,
  archiveSortBy,
  archiveSortOrderValue,
  archiveTypeValue,
}) {
  return {
    activePanelId,
    archiveSearchVisible,
    archiveSearchTerm,
    archiveSortBy,
    archiveSortOrderValue,
    archiveTypeValue,
  };
}

