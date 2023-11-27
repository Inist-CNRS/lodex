import { createAction, handleActions } from 'redux-actions';

export const IMPORT_FIELDS = 'IMPORT_FIELDS';
export const IMPORT_FIELDS_ERROR = 'IMPORT_FIELDS_ERROR';
export const IMPORT_FIELDS_SUCCESS = 'IMPORT_FIELDS_SUCCESS';
export const IMPORT_FIELDS_CLOSED = 'IMPORT_FIELDS_CLOSED';

export const importFields = createAction(IMPORT_FIELDS);
export const importFieldsError = createAction(IMPORT_FIELDS_ERROR);
export const importFieldsSuccess = createAction(IMPORT_FIELDS_SUCCESS);
export const importFieldsClosed = createAction(IMPORT_FIELDS_CLOSED);

export const initialState = {
    status: null,
    loading: false,
    hasEnrichments: false,
    hasPrecomputed: false,
};

export default handleActions(
    {
        IMPORT_FIELDS: state => ({ ...state, loading: true }),
        IMPORT_FIELDS_ERROR: state => ({
            ...state,
            status: 'error',
            loading: false,
        }),
        IMPORT_FIELDS_SUCCESS: (state, { payload }) => ({
            ...state,
            status: 'success',
            loading: false,
            hasEnrichments: payload.hasEnrichments,
            hasPrecomputed: payload.hasPrecomputed,
        }),
        IMPORT_FIELDS_CLOSED: state => ({
            ...state,
            status: null,
            hasEnrichments: false,
            hasPrecomputed: false,
        }),
    },
    initialState,
);

export const hasImportFailed = state => state.status === 'error';
export const hasImportSucceeded = state => state.status === 'success';
export const hasEnrichments = state => state.hasEnrichments;
export const hasPrecomputed = state => state.hasPrecomputed;

export const selectors = {
    hasImportFailed,
    hasImportSucceeded,
    hasEnrichments,
    hasPrecomputed,
};
