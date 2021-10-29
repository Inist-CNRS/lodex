import { createAction, handleActions } from 'redux-actions';

export const LOAD_ENRICHMENTS = 'LOAD_ENRICHMENTS';
export const LOAD_ENRICHMENTS_ERROR = 'LOAD_ENRICHMENTS_ERROR';
export const LOAD_ENRICHMENTS_SUCCESS = 'LOAD_ENRICHMENTS_SUCCESS';
export const CREATE_ENRICHMENT = 'CREATE_ENRICHMENT';
export const UPDATE_ENRICHMENT = 'UPDATE_ENRICHMENT';
export const CREATE_ENRICHMENT_OPTIMISTIC = 'CREATE_ENRICHMENT_OPTIMISTIC';
export const UPDATE_ENRICHMENT_OPTIMISTIC = 'UPDATE_ENRICHMENT_OPTIMISTIC';
export const DELETE_ENRICHMENT = 'DELETE_ENRICHMENT';

export const loadEnrichments = createAction(LOAD_ENRICHMENTS);
export const loadEnrichmentsError = createAction(LOAD_ENRICHMENTS_ERROR);
export const loadEnrichmentsSuccess = createAction(LOAD_ENRICHMENTS_SUCCESS);
export const createEnrichment = createAction(CREATE_ENRICHMENT);
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

export const selectors = {
    isLoading,
    enrichments
};
