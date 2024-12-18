import { createAction, handleActions } from 'redux-actions';

export const LOAD_ENRICHMENTS = 'LOAD_ENRICHMENTS';
export const LOAD_ENRICHMENTS_ERROR = 'LOAD_ENRICHMENTS_ERROR';
export const LOAD_ENRICHMENTS_SUCCESS = 'LOAD_ENRICHMENTS_SUCCESS';
export const LAUNCH_ENRICHMENT = 'LAUNCH_ENRICHMENT';
export const LAUNCH_ALL_ENRICHMENT = 'LAUNCH_ALL_ENRICHMENT';

export const loadEnrichments = createAction(LOAD_ENRICHMENTS);
export const loadEnrichmentsError = createAction(LOAD_ENRICHMENTS_ERROR);
export const loadEnrichmentsSuccess = createAction(LOAD_ENRICHMENTS_SUCCESS);
export const launchEnrichment = createAction(LAUNCH_ENRICHMENT);
export const launchAllEnrichment = createAction(LAUNCH_ALL_ENRICHMENT);

export const initialState = {
    error: null,
    loading: false,
    dataPreviewLoading: false,
    enrichments: [],
    dataPreviewEnrichment: [],
};

export default handleActions(
    {
        LOAD_ENRICHMENTS: (state) => ({ ...state, loading: true }),
        LOAD_ENRICHMENTS_ERROR: (state, { payload: error }) => ({
            ...state,
            error,
            loading: false,
        }),
        LOAD_ENRICHMENTS_SUCCESS: (state, { payload: enrichments }) => ({
            ...state,
            enrichments,
            loading: false,
        }),
    },
    initialState,
);

export const isDataPreviewLoading = (state) => state.dataPreviewLoading;
export const isLoading = (state) => state.loading;
export const enrichments = (state) => state.enrichments;
export const dataPreviewEnrichment = (state) => state.dataPreviewEnrichment;
export const getError = (state) => state.error;

export const selectors = {
    isDataPreviewLoading,
    isLoading,
    enrichments,
    dataPreviewEnrichment,
    getError,
};
