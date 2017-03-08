import { createAction, handleActions } from 'redux-actions';

export const IMPORT_FIELDS = 'IMPORT_FIELDS';
export const IMPORT_FIELDS_ERROR = 'IMPORT_FIELDS_ERROR';
export const IMPORT_FIELDS_SUCCESS = 'IMPORT_FIELDS_SUCCESS';

export const importFields = createAction(IMPORT_FIELDS);
export const importFieldsError = createAction(IMPORT_FIELDS_ERROR);
export const importFieldsSuccess = createAction(IMPORT_FIELDS_SUCCESS);

export const initialState = {
    status: null,
    loading: false,
};

export default handleActions({
    IMPORT_FIELDS: state => ({ ...state, loading: true }),
    IMPORT_FIELDS_ERROR: state => ({ ...state, status: 'error', loading: false }),
    IMPORT_FIELDS_SUCCESS: state => ({ ...state, status: 'success', loading: false }),
}, initialState);

export const hasImportFailed = state => state.status === 'error';
export const hasImportSucceeded = state => state.status === 'success';

export const selectors = {
    hasImportFailed,
    hasImportSucceeded,
};
