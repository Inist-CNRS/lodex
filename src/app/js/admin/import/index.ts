// @ts-expect-error TS7016
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
        // @ts-expect-error TS7006
        IMPORT_FIELDS: (state) => ({ ...state, loading: true }),
        // @ts-expect-error TS7006
        IMPORT_FIELDS_ERROR: (state) => ({
            ...state,
            status: 'error',
            loading: false,
        }),
        // @ts-expect-error TS7006
        IMPORT_FIELDS_SUCCESS: (state, { payload }) => ({
            ...state,
            status: 'success',
            loading: false,
            hasEnrichments: payload.hasEnrichments,
            hasPrecomputed: payload.hasPrecomputed,
        }),
        // @ts-expect-error TS7006
        IMPORT_FIELDS_CLOSED: (state) => ({
            ...state,
            status: null,
            hasEnrichments: false,
            hasPrecomputed: false,
        }),
    },
    initialState,
);

// @ts-expect-error TS7006
export const hasImportFailed = (state) => state.status === 'error';
// @ts-expect-error TS7006
export const hasImportSucceeded = (state) => state.status === 'success';
// @ts-expect-error TS7006
export const hasEnrichments = (state) => state.hasEnrichments;
// @ts-expect-error TS7006
export const hasPrecomputed = (state) => state.hasPrecomputed;

export const selectors = {
    hasImportFailed,
    hasImportSucceeded,
    hasEnrichments,
    hasPrecomputed,
};
