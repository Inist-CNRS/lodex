import { createAction, handleActions } from 'redux-actions';

export const CLEAR_DATASET = 'CLEAR_DATASET';
export const CLEAR_PUBLISHED = 'CLEAR_PUBLISHED';
export const CLEAR_DATASET_ERROR = 'CLEAR_DATASET_ERROR';
export const CLEAR_PUBLISHED_ERROR = 'CLEAR_PUBLISHED_ERROR';
export const CLEAR_DATASET_SUCCESS = 'CLEAR_DATASET_SUCCESS';
export const CLEAR_PUBLISHED_SUCCESS = 'CLEAR_PUBLISHED_SUCCESS';

export const clearDataset = createAction(CLEAR_DATASET);
export const clearPublished = createAction(CLEAR_PUBLISHED);
export const clearPublishedError = createAction(CLEAR_PUBLISHED_ERROR);
export const clearPublishedSuccess = createAction(CLEAR_PUBLISHED_SUCCESS);
export const clearDatasetError = createAction(CLEAR_DATASET_ERROR);
export const clearDatasetSuccess = createAction(CLEAR_DATASET_SUCCESS);

export const initialState = {
    status: null,
    error: null,
    loading: false,
};

export default handleActions(
    {
        CLEAR_DATASET: state => ({ ...state, loading: true }),
        CLEAR_PUBLISHED: state => ({ ...state, loading: true }),
        CLEAR_DATASET_ERROR: (state, { payload: error }) => ({
            ...state,
            status: 'error',
            error,
            loading: false,
        }),
        CLEAR_DATASET_SUCCESS: state => {
            window.location.href = '/admin';
            return {
                ...state,
                status: 'success',
                loading: false,
            };
        },
        CLEAR_PUBLISHED_ERROR: (state, { payload: error }) => ({
            ...state,
            status: 'error',
            error,
            loading: false,
        }),
        CLEAR_PUBLISHED_SUCCESS: state => {
            window.location.href = '/admin';
            return {
                ...state,
                status: 'success',
                loading: false,
            };
        },
    },
    initialState,
);

export const getIsClearing = state => state.loading;
export const hasClearSucceeded = state => state.status === 'success';
export const hasClearFailed = state => state.status === 'error';

export const selectors = {
    getIsClearing,
    hasClearSucceeded,
    hasClearFailed,
};
