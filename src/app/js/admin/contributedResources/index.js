import { createAction, handleActions } from 'redux-actions';

export const LOAD_CONTRIBUTED_RESOURCE_PAGE = 'LOAD_CONTRIBUTED_RESOURCE_PAGE';
export const LOAD_CONTRIBUTED_RESOURCE_PAGE_ERROR = 'LOAD_CONTRIBUTED_RESOURCE_PAGE_ERROR';
export const LOAD_CONTRIBUTED_RESOURCE_PAGE_SUCCESS = 'LOAD_CONTRIBUTED_RESOURCE_PAGE_SUCCESS';

export const loadContributedResourcePage = createAction(LOAD_CONTRIBUTED_RESOURCE_PAGE);
export const loadContributedResourcePageError = createAction(LOAD_CONTRIBUTED_RESOURCE_PAGE_ERROR);
export const loadContributedResourcePageSuccess = createAction(LOAD_CONTRIBUTED_RESOURCE_PAGE_SUCCESS);

export const defaultState = {
    currentPage: 0,
    error: false,
    loading: false,
    items: [],
    total: 0,
};

export default handleActions({
    LOAD_CONTRIBUTED_RESOURCE_PAGE: state => ({
        ...state,
        loading: true,
    }),
    LOAD_CONTRIBUTED_RESOURCE_PAGE_ERROR: (state, { payload: error }) => ({
        ...state,
        loading: false,
        error: error.message || error,
    }),
    LOAD_CONTRIBUTED_RESOURCE_PAGE_SUCCESS: (state, {
        payload: {
            resources: items,
            page: currentPage,
            total,
        },
    }) => ({
        ...state,
        currentPage,
        error: false,
        loading: false,
        items,
        total,
    }),
}, defaultState);

export const isContributedResourceLoading = state => state.loading;
export const getContributedResourceCurrentPage = state => state.currentPage;
export const getContributedResourceTotal = state => state.total;
export const getContributedResourceItems = state => state.items;

export const selectors = {
    isContributedResourceLoading,
    getContributedResourceCurrentPage,
    getContributedResourceTotal,
    getContributedResourceItems,
};
