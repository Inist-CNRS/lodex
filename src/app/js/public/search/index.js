import { createAction, handleActions, combineActions } from 'redux-actions';

export const SEARCH = 'SEARCH';
export const SEARCH_RESULTS = 'SEARCH_RESULTS';
export const SEARCH_ERROR = 'SEARCH_ERROR';

export const search = createAction(SEARCH);
export const searchSucceed = createAction(SEARCH_RESULTS);
export const searchFailed = createAction(SEARCH_ERROR);

export const defaultState = {
    dataset: [],
    loading: true,
};

export const fromSearch = {
    isLoading: state => state.search.loading,
};

export default handleActions(
    {
        SEARCH: state => ({
            ...state,
        }),
        [combineActions(SEARCH_RESULTS, SEARCH_ERROR)]: state => ({
            ...state,
            loading: false,
        }),
    },
    defaultState,
);
