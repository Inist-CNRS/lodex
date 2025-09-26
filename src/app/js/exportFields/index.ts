import { createAction } from 'redux-actions';

export const EXPORT_FIELDS = 'EXPORT_FIELDS';
export const EXPORT_FIELDS_ERROR = 'EXPORT_FIELDS_ERROR';
export const EXPORT_FIELDS_SUCCESS = 'EXPORT_FIELDS_SUCCESS';

export const exportFields = createAction(EXPORT_FIELDS);
export const exportFieldsError = createAction(EXPORT_FIELDS_ERROR);
export const exportFieldsSuccess = createAction(EXPORT_FIELDS_SUCCESS);
