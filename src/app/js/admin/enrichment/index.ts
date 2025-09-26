// @ts-expect-error TS7016
import { createAction, handleActions } from 'redux-actions';

export const LOAD_ENRICHMENTS = 'LOAD_ENRICHMENTS';
export const LOAD_ENRICHMENTS_ERROR = 'LOAD_ENRICHMENTS_ERROR';
export const LOAD_ENRICHMENTS_SUCCESS = 'LOAD_ENRICHMENTS_SUCCESS';
export const LAUNCH_ENRICHMENT = 'LAUNCH_ENRICHMENT';
export const LAUNCH_ALL_ENRICHMENT = 'LAUNCH_ALL_ENRICHMENT';
export const LAUNCH_ALL_ENRICHMENT_STARTED = 'LAUNCH_ALL_ENRICHMENT_STARTED';
export const LAUNCH_ALL_ENRICHMENT_COMPLETED =
    'LAUNCH_ALL_ENRICHMENT_COMPLETED';
export const LAUNCH_ALL_ENRICHMENT_ERROR = 'LAUNCH_ALL_ENRICHMENT_ERROR';
export const RETRY_ENRICHMENT = 'RETRY_ENRICHMENT';

export const loadEnrichments = createAction(LOAD_ENRICHMENTS);
export const loadEnrichmentsError = createAction(LOAD_ENRICHMENTS_ERROR);
export const loadEnrichmentsSuccess = createAction(LOAD_ENRICHMENTS_SUCCESS);
export const launchEnrichment = createAction(LAUNCH_ENRICHMENT);
export const launchAllEnrichment = createAction(LAUNCH_ALL_ENRICHMENT);
export const retryEnrichment = createAction(RETRY_ENRICHMENT);
export const launchAllEnrichmentStarted = createAction(
    LAUNCH_ALL_ENRICHMENT_STARTED,
);
export const launchAllEnrichmentCompleted = createAction(
    LAUNCH_ALL_ENRICHMENT_COMPLETED,
);
export const launchAllEnrichmentError = createAction(
    LAUNCH_ALL_ENRICHMENT_ERROR,
);

export const initialState = {
    error: null,
    initialized: false,
    loading: false,
    dataPreviewLoading: false,
    enrichments: [],
    dataPreviewEnrichment: [],
};

export default handleActions(
    {
        // @ts-expect-error TS7006
        LOAD_ENRICHMENTS: (state) => ({
            ...state,
            isLoadEnrichmentsPending: true,
            initialized: true,
        }),
        // @ts-expect-error TS7006
        LOAD_ENRICHMENTS_ERROR: (state, { payload: error }) => ({
            ...state,
            error,
            isLoadEnrichmentsPending: false,
        }),
        // @ts-expect-error TS7006
        LOAD_ENRICHMENTS_SUCCESS: (state, { payload: enrichments }) => ({
            ...state,
            enrichments,
            isLoadEnrichmentsPending: false,
        }),
        // @ts-expect-error TS7006
        LAUNCH_ALL_ENRICHMENT_STARTED: (state) => ({
            ...state,
            isRunAllEnrichmentPending: true,
            runAllEnrichmentError: null,
        }),
        // @ts-expect-error TS7006
        LAUNCH_ALL_ENRICHMENT_ERROR: (state, { payload: error }) => ({
            ...state,
            runAllEnrichmentError: error,
        }),
        // @ts-expect-error TS7006
        LAUNCH_ALL_ENRICHMENT_COMPLETED: (state) => ({
            ...state,
            isRunAllEnrichmentPending: false,
        }),
    },
    initialState,
);

// @ts-expect-error TS7006
export const isDataPreviewLoading = (state) => state.dataPreviewLoading;
// @ts-expect-error TS7006
export const isInitialized = (state) => state.initialized;
// @ts-expect-error TS7006
export const enrichments = (state) => state.enrichments;
// @ts-expect-error TS7006
export const dataPreviewEnrichment = (state) => state.dataPreviewEnrichment;
// @ts-expect-error TS7006
export const getError = (state) => state.error;

export const selectors = {
    isDataPreviewLoading,
    isInitialized,
    enrichments,
    dataPreviewEnrichment,
    getError,
};
