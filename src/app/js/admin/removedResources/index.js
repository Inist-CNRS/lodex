import { combineActions, createAction, handleActions } from 'redux-actions';

export const LOAD_REMOVED_RESOURCE_PAGE = 'LOAD_REMOVED_RESOURCE_PAGE';
export const LOAD_REMOVED_RESOURCE_PAGE_ERROR = 'LOAD_REMOVED_RESOURCE_PAGE_ERROR';
export const LOAD_REMOVED_RESOURCE_PAGE_SUCCESS = 'LOAD_REMOVED_RESOURCE_PAGE_SUCCESS';

export const RESTORE_RESOURCE = 'RESTORE_RESOURCE';
export const RESTORE_RESOURCE_ERROR = 'RESTORE_RESOURCE_ERROR';
export const RESTORE_RESOURCE_SUCCESS = 'RESTORE_RESOURCE_SUCCESS';

export const loadRemovedResourcePage = createAction(LOAD_REMOVED_RESOURCE_PAGE);
export const loadRemovedResourcePageError = createAction(LOAD_REMOVED_RESOURCE_PAGE_ERROR);
export const loadRemovedResourcePageSuccess = createAction(LOAD_REMOVED_RESOURCE_PAGE_SUCCESS);

export const restoreRessource = createAction(RESTORE_RESOURCE);
export const restoreRessourceError = createAction(RESTORE_RESOURCE_ERROR);
export const restoreRessourceSuccess = createAction(RESTORE_RESOURCE_SUCCESS);

export const defaultState = {
    currentPage: 0,
    error: false,
    loading: false,
    items: [],
    total: 0,
};

export default handleActions({
    [combineActions(LOAD_REMOVED_RESOURCE_PAGE, RESTORE_RESOURCE)]: state => ({
        ...state,
        loading: true,
    }),
    [combineActions(LOAD_REMOVED_RESOURCE_PAGE_ERROR, RESTORE_RESOURCE_ERROR)]: (state, { payload: error }) => ({
        ...state,
        error: error.message || error,
        loading: false,
    }),
    LOAD_REMOVED_RESOURCE_PAGE_SUCCESS: (state, { payload: { resources: items, page: currentPage, total } }) => ({
        ...state,
        currentPage,
        error: false,
        loading: false,
        items,
        total,
    }),
    RESTORE_RESOURCE_SUCCESS: ({ items, ...state }, { payload: uri }) => ({
        ...state,
        error: false,
        loading: false,
        items: items.filter(r => r.uri !== uri),
    }),
}, defaultState);

export const isRemovedResourceLoading = state => state.removedResources.loading;
export const getRemovedResourceCurrentPage = state => state.removedResources.currentPage;
export const getRemovedResourceTotal = state => state.removedResources.total;
export const getRemovedResourceItems = state => state.removedResources.items;
