import { createAction } from 'redux-actions';

export const UPLOAD_FILE = 'UPLOAD_FILE';
export const UPLOAD_FILE_ERROR = 'UPLOAD_FILE_ERROR';
export const UPLOAD_FILE_PENDING = 'UPLOAD_FILE_PENDING';
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';

export const uploadFile = createAction(UPLOAD_FILE);
export const uploadFilePending = createAction(UPLOAD_FILE_PENDING);
export const uploadFileSuccess = createAction(UPLOAD_FILE_SUCCESS);
export const uploadFileError = createAction(UPLOAD_FILE_ERROR);
