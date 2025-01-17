import { createAction, handleActions } from 'redux-actions';

export const LOAD_ENRICHMENTS = 'LOAD_ENRICHMENTS';
export const LOAD_ENRICHMENTS_ERROR = 'LOAD_ENRICHMENTS_ERROR';
export const LOAD_ENRICHMENTS_SUCCESS = 'LOAD_ENRICHMENTS_SUCCESS';
export const LAUNCH_ENRICHMENT = 'LAUNCH_ENRICHMENT';
export const LAUNCH_ALL_ENRICHMENT = 'LAUNCH_ALL_ENRICHMENT';
export const LAUNCH_ALL_ENRICHMENT_STARTED = 'LAUNCH_ALL_ENRICHMENT_STARTED';
export const LAUNCH_ALL_ENRICHMENT_COMPLETED =
    'LAUNCH_ALL_ENRICHMENT_COMPLETED';
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

export const initialState = {
    error: null,
    loading: false,
    dataPreviewLoading: false,
    enrichments: [],
    dataPreviewEnrichment: [],
};

export default handleActions(
    {
        LOAD_ENRICHMENTS: (state) => ({
            ...state,
            isLoadEnrichmentsPending: true,
        }),
        LOAD_ENRICHMENTS_ERROR: (state, { payload: error }) => ({
            ...state,
            error,
            isLoadEnrichmentsPending: false,
        }),
        LOAD_ENRICHMENTS_SUCCESS: (state, { payload: enrichments }) => ({
            ...state,
            enrichments,
            isLoadEnrichmentsPending: false,
        }),
        LAUNCH_ALL_ENRICHMENT_STARTED: (state) => ({
            ...state,
            isRunAllEnrichmentPending: true,
        }),
        LAUNCH_ALL_ENRICHMENT_COMPLETED: (state) => ({
            ...state,
            isRunAllEnrichmentPending: false,
        }),
    },
    initialState,
);

export const isDataPreviewLoading = (state) => state.dataPreviewLoading;
export const enrichments = (state) => state.enrichments;
export const dataPreviewEnrichment = (state) => state.dataPreviewEnrichment;
export const getError = (state) => state.error;

export const selectors = {
    isDataPreviewLoading,
    enrichments,
    dataPreviewEnrichment,
    getError,
};
