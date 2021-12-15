import { createAction, handleActions } from 'redux-actions';

export const LOAD_ENRICHMENTS = 'LOAD_ENRICHMENTS';
export const LOAD_ENRICHMENTS_ERROR = 'LOAD_ENRICHMENTS_ERROR';
export const LOAD_ENRICHMENTS_SUCCESS = 'LOAD_ENRICHMENTS_SUCCESS';
export const CREATE_ENRICHMENT = 'CREATE_ENRICHMENT';
export const CREATE_ENRICHMENT_ERROR = 'CREATE_ENRICHMENT_ERROR';
export const LAUNCH_ENRICHMENT = 'LAUNCH_ENRICHMENT';
export const PREVIEW_DATA_ENRICHMENT = 'PREVIEW_DATA_ENRICHMENT';
export const PREVIEW_DATA_ENRICHMENT_SUCESS = 'PREVIEW_DATA_ENRICHMENT_SUCESS';
export const UPDATE_ENRICHMENT = 'UPDATE_ENRICHMENT';
export const CREATE_ENRICHMENT_OPTIMISTIC = 'CREATE_ENRICHMENT_OPTIMISTIC';
export const UPDATE_ENRICHMENT_OPTIMISTIC = 'UPDATE_ENRICHMENT_OPTIMISTIC';
export const DELETE_ENRICHMENT = 'DELETE_ENRICHMENT';

export const loadEnrichments = createAction(LOAD_ENRICHMENTS);
export const loadEnrichmentsError = createAction(LOAD_ENRICHMENTS_ERROR);
export const loadEnrichmentsSuccess = createAction(LOAD_ENRICHMENTS_SUCCESS);
export const createEnrichment = createAction(CREATE_ENRICHMENT);
export const createEnrichmentError = createAction(CREATE_ENRICHMENT_ERROR);
export const launchEnrichment = createAction(LAUNCH_ENRICHMENT);
export const previewDataEnrichment = createAction(PREVIEW_DATA_ENRICHMENT);
export const previewDataEnrichmentSuccess = createAction(
    PREVIEW_DATA_ENRICHMENT_SUCESS,
);
export const updateEnrichment = createAction(UPDATE_ENRICHMENT);
export const createEnrichmentOptimistic = createAction(
    CREATE_ENRICHMENT_OPTIMISTIC,
);
export const updateEnrichmentOptimistic = createAction(
    UPDATE_ENRICHMENT_OPTIMISTIC,
);
export const deleteEnrichment = createAction(DELETE_ENRICHMENT);

export const initialState = {
    error: null,
    loading: false,
    enrichments: [],
    dataPreviewEnrichment: [],
};

export default handleActions(
    {
        LOAD_ENRICHMENTS: state => ({ ...state, loading: true }),
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
        CREATE_ENRICHMENT_OPTIMISTIC: (state, { payload: enrichment }) => ({
            ...state,
            enrichments: [...state.enrichments, enrichment],
            error: null,
        }),
        PREVIEW_DATA_ENRICHMENT_SUCESS: (
            state,
            { payload: dataPreviewEnrichment },
        ) => ({
            ...state,
            dataPreviewEnrichment: [
                ...state.dataPreviewEnrichment,
                dataPreviewEnrichment,
            ],
            error: null,
        }),
        CREATE_ENRICHMENT_ERROR: (state, { payload: error }) => ({
            ...state,
            error,
        }),
        UPDATE_ENRICHMENT_OPTIMISTIC: (state, { payload: enrichment }) => ({
            ...state,
            enrichments: state.enrichments.map(e => {
                if (e._id === enrichment._id) {
                    return enrichments;
                }

                return e;
            }),
        }),
    },
    initialState,
);

export const isLoading = state => state.loading;
export const enrichments = state => state.enrichments;
export const getError = state => state.error;

export const selectors = {
    isLoading,
    enrichments,
    getError,
};
