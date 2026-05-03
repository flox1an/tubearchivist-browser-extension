import { formatResultCount } from './formatters.js';

export function createPagedList({
  messageType,
  listElement,
  stateElement,
  countElement,
  sentinel,
  renderItem,
  sendMessage,
  setBadge,
  itemFilter = null,
  buildRequest = null,
  emptyEndMessage = 'End of list.',
}) {
  let state = {
    nextPage: 1,
    loading: false,
    hasMore: true,
    loaded: false,
    totalLoaded: 0,
  };

  function setListState(message, badgeState = 'idle') {
    stateElement.textContent = message;
    stateElement.dataset.state = badgeState;
  }

  function reset() {
    state.nextPage = 1;
    state.loading = false;
    state.hasMore = true;
    state.loaded = false;
    state.totalLoaded = 0;
    listElement.replaceChildren();
    setBadge(countElement, '0', 'idle');
    setListState('Loading...');
  }

  async function loadNextPage() {
    if (state.loading || !state.hasMore) return;

    state.loading = true;
    setListState(state.totalLoaded > 0 ? 'Loading more...' : 'Loading...');

    try {
      let page = state.nextPage;
      let message = buildRequest ? buildRequest(page) : { type: messageType, page };
      let response = await sendMessage(message);
      if (response?.detail || response?.error) {
        throw new Error(response.detail || response.error);
      }

      let items = Array.isArray(response?.data) ? response.data : [];
      if (itemFilter) {
        items = items.filter(itemFilter);
      }
      let pagination = response?.paginate || {};

      for (let item of items) {
        listElement.appendChild(renderItem(item));
      }

      state.totalLoaded += items.length;
      state.loaded = true;
      state.nextPage = page + 1;

      let lastPage = Number(pagination.last_page);
      state.hasMore = Boolean(lastPage && page < lastPage);
      if (!items.length) {
        state.hasMore = false;
      }

      let total = pagination.total_hits ?? state.totalLoaded;
      let countLabel = formatResultCount(total, Boolean(pagination.max_hits));
      setBadge(countElement, countLabel, state.totalLoaded > 0 ? 'enabled' : 'idle');

      if (!state.totalLoaded) {
        setListState('No items found.', 'idle');
      } else if (state.hasMore) {
        setListState('Scroll for more.', 'idle');
      } else {
        setListState(emptyEndMessage, 'success');
      }
    } catch (error) {
      if (state.totalLoaded > 0 && error === 'Not found.') {
        state.hasMore = false;
        setListState('End of list.', 'success');
      } else {
        state.hasMore = false;
        setListState(error?.message ?? error, 'error');
      }
    } finally {
      state.loading = false;
    }
  }

  let observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      loadNextPage();
    }
  });
  observer.observe(sentinel);

  return {
    loadNextPage,
    reset,
    get loaded() {
      return state.loaded;
    },
  };
}
