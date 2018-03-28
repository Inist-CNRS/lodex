import { createAction } from 'redux-actions';

export const EXPORT_FIELDS_READY = 'EXPORT_FIELDS_READY';
export const EXPORT_FIELDS_ERROR = 'EXPORT_FIELDS_ERROR';
export const EXPORT_FIELDS_SUCCESS = 'EXPORT_FIELDS_SUCCESS';

export const exportFieldsReady = createAction(EXPORT_FIELDS_READY);
export const exportFieldsError = createAction(EXPORT_FIELDS_ERROR);
export const exportFieldsSuccess = createAction(EXPORT_FIELDS_SUCCESS);
