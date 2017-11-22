import { createAction, handleActions } from 'redux-actions';

import { PROPOSED } from '../../../../common/propositionStatus';

export const LOAD_CONTRIBUTED_RESOURCE_PAGE = 'LOAD_CONTRIBUTED_RESOURCE_PAGE';
export const LOAD_CONTRIBUTED_RESOURCE_PAGE_ERROR =
    'LOAD_CONTRIBUTED_RESOURCE_PAGE_ERROR';
export const LOAD_CONTRIBUTED_RESOURCE_PAGE_SUCCESS =
    'LOAD_CONTRIBUTED_RESOURCE_PAGE_SUCCESS';

export const CHANGE_CONTRIBUTED_RESOURCE_FILTER =
    'CHANGE_CONTRIBUTED_RESOURCE_FILTER';

export const loadContributedResourcePage = createAction(
    LOAD_CONTRIBUTED_RESOURCE_PAGE,
);
export const loadContributedResourcePageError = createAction(
    LOAD_CONTRIBUTED_RESOURCE_PAGE_ERROR,
);
export const loadContributedResourcePageSuccess = createAction(
    LOAD_CONTRIBUTED_RESOURCE_PAGE_SUCCESS,
);
export const changeContributedResourceFilter = createAction(
    CHANGE_CONTRIBUTED_RESOURCE_FILTER,
);

export const defaultState = {
    currentPage: 0,
    perPage: 10,
    error: false,
    loading: false,
    items: [],
    total: 0,
    filter: PROPOSED,
};

export default handleActions(
    {
        LOAD_CONTRIBUTED_RESOURCE_PAGE: state => ({
            ...state,
            loading: true,
        }),
        LOAD_CONTRIBUTED_RESOURCE_PAGE_ERROR: (state, { payload: error }) => ({
            ...state,
            loading: false,
            error: error.message || error,
        }),
        LOAD_CONTRIBUTED_RESOURCE_PAGE_SUCCESS: (
            state,
            { payload: { resources: items, page: currentPage, total } },
        ) => ({
            ...state,
            currentPage,
            error: false,
            loading: false,
            items,
            total,
        }),
        CHANGE_CONTRIBUTED_RESOURCE_FILTER: (state, { payload: filter }) => ({
            ...state,
            filter,
        }),
    },
    defaultState,
);

export const isContributedResourceLoading = state => state.loading;
export const getContributedResourceCurrentPage = state => state.currentPage;
export const getContributedResourceTotal = state => state.total;
export const getContributedResourceItems = state => state.items;
export const getContributedResourceFilter = state => state.filter;
export const getRequestData = ({ currentPage: page, perPage, filter }) => ({
    page,
    perPage,
    filter,
});

export const selectors = {
    isContributedResourceLoading,
    getContributedResourceCurrentPage,
    getContributedResourceTotal,
    getContributedResourceItems,
    getContributedResourceFilter,
    getRequestData,
};
