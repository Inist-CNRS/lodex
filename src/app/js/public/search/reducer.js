import { createAction, handleActions, combineActions } from 'redux-actions';

export const SEARCH = 'SEARCH';
export const SEARCH_RESULTS = 'SEARCH_RESULTS';
export const SEARCH_ERROR = 'SEARCH_ERROR';

export const SEARCH_LOAD_MORE = 'SEARCH_LOAD_MORE';
export const SEARCH_LOAD_MORE_SUCCESS = 'SEARCH_LOAD_MORE_SUCCESS';
export const SEARCH_LOAD_MORE_ERROR = 'SEARCH_LOAD_MORE_ERROR';

export const search = createAction(SEARCH);
export const searchSucceed = createAction(SEARCH_RESULTS);
export const searchFailed = createAction(SEARCH_ERROR);

export const loadMore = createAction(SEARCH_LOAD_MORE);
export const loadMoreSucceed = createAction(SEARCH_LOAD_MORE_SUCCESS);
export const loadMoreFailed = createAction(SEARCH_LOAD_MORE_ERROR);

export const fromSearch = {
    isLoading: state => state.search.loading,
    getDataset: state => state.search.dataset,
    getFieldNames: state => state.search.fields,
    getPage: state => state.search.page,
    getTotal: state => state.search.total,
    getQuery: state => state.search.query,
};

export const defaultState = {
    dataset: [],
    fields: {},
    loading: false,
    page: null,
    total: 0,
    query: null,
};

export default handleActions(
    {
        [SEARCH]: (state, { payload }) => ({
            ...state,
            dataset: [],
            loading: true,
            page: 0,
            total: 0,
            query: payload.query,
        }),
        [combineActions(SEARCH_RESULTS, SEARCH_ERROR)]: (
            state,
            { payload },
        ) => ({
            ...state,
            loading: false,
            dataset: payload.dataset || [],
            total: payload.total || 0,
            fields: payload.fields || state.fields,
        }),
        [SEARCH_LOAD_MORE]: state => ({
            ...state,
            loading: true,
        }),
        [combineActions(SEARCH_LOAD_MORE_SUCCESS, SEARCH_LOAD_MORE_ERROR)]: (
            state,
            { payload },
        ) => ({
            ...state,
            loading: false,
            dataset: [...state.dataset, ...(payload.dataset || [])],
            page: payload.page || state.page + 1,
            total: payload.total || state.total,
        }),
    },
    defaultState,
);
