import { createAction, handleActions } from 'redux-actions';

export const LOAD_PRECOMPUTED = 'LOAD_PRECOMPUTED';
export const LOAD_PRECOMPUTED_ERROR = 'LOAD_PRECOMPUTED_ERROR';
export const LOAD_PRECOMPUTED_SUCCESS = 'LOAD_PRECOMPUTED_SUCCESS';
export const LAUNCH_PRECOMPUTED = 'LAUNCH_PRECOMPUTED';

export const loadPrecomputed = createAction(LOAD_PRECOMPUTED);
export const loadPrecomputedError = createAction(LOAD_PRECOMPUTED_ERROR);
export const loadPrecomputedSuccess = createAction(LOAD_PRECOMPUTED_SUCCESS);
export const launchPrecomputed = createAction(LAUNCH_PRECOMPUTED);

export const initialState = {
    error: null,
    initialized: false,
    loading: false,
    dataPreviewLoading: false,
    precomputed: [],
    dataPreviewPrecomputed: [],
};

// @ts-expect-error TS7006
export default handleActions(
    {
        LOAD_PRECOMPUTED: (state) => ({
            ...state,
            loading: true,
            initialized: true,
        }),
        LOAD_PRECOMPUTED_ERROR: (state, { payload: error }) => ({
            ...state,
            error,
            loading: false,
        }),
        LOAD_PRECOMPUTED_SUCCESS: (state, { payload: precomputed }) => ({
            ...state,
            precomputed,
            loading: false,
        }),
    },
    initialState,
);

// @ts-expect-error TS7006
export const isDataPreviewLoading = (state) => state.dataPreviewLoading;
// @ts-expect-error TS7006
export const isLoading = (state) => state.loading;
// @ts-expect-error TS7006
export const isInitialized = (state) => state.initialized;
// @ts-expect-error TS7006
export const precomputed = (state) => state.precomputed;
// @ts-expect-error TS7006
export const dataPreviewPrecomputed = (state) => state.dataPreviewPrecomputed;
// @ts-expect-error TS7006
export const getError = (state) => state.error;

export const selectors = {
    isDataPreviewLoading,
    isLoading,
    isInitialized,
    precomputed,
    dataPreviewPrecomputed,
    getError,
};
