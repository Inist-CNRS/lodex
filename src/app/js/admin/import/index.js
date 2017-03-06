import { createAction } from 'redux-actions';

export const IMPORT_FIELDS = 'IMPORT_FIELDS';
export const IMPORT_FIELDS_ERROR = 'IMPORT_FIELDS_ERROR';
export const IMPORT_FIELDS_SUCCESS = 'IMPORT_FIELDS_SUCCESS';

export const importFields = createAction(IMPORT_FIELDS);
export const importFieldsError = createAction(IMPORT_FIELDS_ERROR);
export const importFieldsSuccess = createAction(IMPORT_FIELDS_SUCCESS);
