import { createAction, handleActions } from 'redux-actions';

export const UPLOAD_FILE = 'UPLOAD_FILE';
export const UPLOAD_FILE_ERROR = 'UPLOAD_FILE_ERROR';
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';

export const defaultState = {
    error: false,
    status: 'NONE',
};

export default handleActions({
    UPLOAD_FILE: state => ({
        ...state,
        error: false,
        status: 'PENDING',
    }),
    UPLOAD_FILE_SUCCESS: state => ({
        ...state,
        status: 'SUCCESS',
    }),
    UPLOAD_FILE_ERROR: (state, { payload }) => ({
        ...state,
        status: 'ERROR',
        error: payload.message,
    }),
}, defaultState);

export const uploadFile = createAction(UPLOAD_FILE);
export const uploadFileSuccess = createAction(UPLOAD_FILE_SUCCESS);
export const uploadFileError = createAction(UPLOAD_FILE_ERROR);

export const getUpload = state => state.upload;
export const isUploadPending = state => state.upload.status === 'PENDING';
