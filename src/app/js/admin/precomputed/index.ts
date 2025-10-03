import { createAction, handleActions } from 'redux-actions';

export const LOAD_PRECOMPUTED = 'LOAD_PRECOMPUTED';
export const LOAD_PRECOMPUTED_ERROR = 'LOAD_PRECOMPUTED_ERROR';
export const LOAD_PRECOMPUTED_SUCCESS = 'LOAD_PRECOMPUTED_SUCCESS';
export const LAUNCH_PRECOMPUTED = 'LAUNCH_PRECOMPUTED';

export const loadPrecomputed = createAction<void>(LOAD_PRECOMPUTED);
export const loadPrecomputedError = createAction<Error>(LOAD_PRECOMPUTED_ERROR);
export const loadPrecomputedSuccess = createAction<{
    precomputed: Array<{ _id: string; status: string }>;
}>(LOAD_PRECOMPUTED_SUCCESS);
export const launchPrecomputed = createAction(LAUNCH_PRECOMPUTED);

export type PrecomputedState = {
    error: Error | null;
    initialized: boolean;
    loading: boolean;
    dataPreviewLoading: boolean;
    precomputed: Array<{ _id: string; status: string; name: string }>;
    dataPreviewPrecomputed: Array<{ _id: string; status: string }>;
};

export const initialState: PrecomputedState = {
    error: null,
    initialized: false,
    loading: false,
    dataPreviewLoading: false,
    precomputed: [],
    dataPreviewPrecomputed: [],
};

export default handleActions<PrecomputedState, any>(
    {
        LOAD_PRECOMPUTED: (state) => ({
            ...state,
            loading: true,
            initialized: true,
        }),
        LOAD_PRECOMPUTED_ERROR: (
            state: PrecomputedState,
            { payload: error }: { payload: Error },
        ) => ({
            ...state,
            error,
            loading: false,
        }),
        LOAD_PRECOMPUTED_SUCCESS: (
            state,
            {
                payload: precomputed,
            }: {
                payload: { _id: string; status: string; name: string }[];
            },
        ) => ({
            ...state,
            precomputed,
            loading: false,
        }),
    },
    initialState,
);

export const isDataPreviewLoading = (state: PrecomputedState) =>
    state.dataPreviewLoading;
export const isLoading = (state: PrecomputedState) => state.loading;
export const isInitialized = (state: PrecomputedState) => state.initialized;
export const precomputed = (state: PrecomputedState) => state.precomputed;
export const dataPreviewPrecomputed = (state: PrecomputedState) =>
    state.dataPreviewPrecomputed;
export const getError = (state: PrecomputedState) => state.error;

export const selectors = {
    isDataPreviewLoading,
    isLoading,
    isInitialized,
    precomputed,
    dataPreviewPrecomputed,
    getError,
};
