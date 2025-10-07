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

export type Enrichment = {
    _id: string;
    sourceColumn: string;
    status: string;
    subPath: string;
    advancedMode: boolean;
    rule: string;
    jobId: string;
    errorCount: number;
};

type EnrichmentState = {
    error: string | null;
    initialized: boolean;
    loading: boolean;
    dataPreviewLoading: boolean;
    enrichments: Enrichment[];
    dataPreviewEnrichment: unknown[];
    isLoadEnrichmentsPending?: boolean;
    isRunAllEnrichmentPending?: boolean;
    runAllEnrichmentError?: string | null;
    jobId?: string;
    sourceColumn?: string;
};

export const initialState: EnrichmentState = {
    error: null,
    initialized: false,
    loading: false,
    dataPreviewLoading: false,
    enrichments: [],
    dataPreviewEnrichment: [],
};

export default handleActions<EnrichmentState, any>(
    {
        LOAD_ENRICHMENTS: (state) => ({
            ...state,
            isLoadEnrichmentsPending: true,
            initialized: true,
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
            runAllEnrichmentError: null,
        }),
        LAUNCH_ALL_ENRICHMENT_ERROR: (state, { payload: error }) => ({
            ...state,
            runAllEnrichmentError: error,
        }),
        LAUNCH_ALL_ENRICHMENT_COMPLETED: (state) => ({
            ...state,
            isRunAllEnrichmentPending: false,
        }),
    },
    initialState,
);

export const isDataPreviewLoading = (state: EnrichmentState) =>
    state.dataPreviewLoading;
export const isInitialized = (state: EnrichmentState) => state.initialized;
export const enrichments = (state: EnrichmentState): Enrichment[] =>
    state.enrichments;
export const dataPreviewEnrichment = (state: EnrichmentState) =>
    state.dataPreviewEnrichment;
export const getError = (state: EnrichmentState) => state.error;

export const selectors = {
    isDataPreviewLoading,
    isInitialized,
    enrichments,
    dataPreviewEnrichment,
    getError,
};
