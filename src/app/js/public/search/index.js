import { createAction, handleActions, combineActions } from 'redux-actions';

export const SEARCH = 'SEARCH';
export const SEARCH_RESULTS = 'SEARCH_RESULTS';
export const SEARCH_ERROR = 'SEARCH_ERROR';

export const search = createAction(SEARCH);
export const searchSucceed = createAction(SEARCH_RESULTS);
export const searchFailed = createAction(SEARCH_ERROR);

export const fromSearch = {
    isLoading: state => state.search.loading,
    getDataset: state => state.search.dataset,
    getFieldNames: state => state.search.fields,
};

export const defaultState = {
    dataset: [],
    fields: {},
    loading: false,
};

export default handleActions(
    {
        [SEARCH]: state => ({
            ...state,
            loading: true,
        }),
        [combineActions(SEARCH_RESULTS, SEARCH_ERROR)]: (
            state,
            { payload },
        ) => ({
            ...state,
            loading: false,
            dataset: payload.dataset || [],
            fields: payload.fields || state.fields,
        }),
    },
    defaultState,
);
