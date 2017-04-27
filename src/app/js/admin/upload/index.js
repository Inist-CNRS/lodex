import { createAction, handleActions } from 'redux-actions';

export const UPLOAD_FILE = 'UPLOAD_FILE';
export const UPLOAD_FILE_ERROR = 'UPLOAD_FILE_ERROR';
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';
export const OPEN_UPLOAD = 'OPEN_UPLOAD';
export const CLOSE_UPLOAD = 'CLOSE_UPLOAD';

export const uploadFile = createAction(UPLOAD_FILE);
export const uploadFileSuccess = createAction(UPLOAD_FILE_SUCCESS);
export const uploadFileError = createAction(UPLOAD_FILE_ERROR);
export const openUpload = createAction(OPEN_UPLOAD);
export const closeUpload = createAction(CLOSE_UPLOAD);

export const defaultState = {
    error: false,
    status: 'NONE',
    open: false,
};

export default handleActions({
    UPLOAD_FILE: (state, { payload }) => (payload ? ({
        ...state,
        error: false,
        open: false,
        status: 'PENDING',
    }) : state),
    UPLOAD_FILE_SUCCESS: state => ({
        ...state,
        status: 'SUCCESS',
    }),
    UPLOAD_FILE_ERROR: (state, { payload }) => ({
        ...state,
        status: 'ERROR',
        error: payload.message,
    }),
    OPEN_UPLOAD: state => ({
        ...state,
        open: true,
    }),
    CLOSE_UPLOAD: state => ({
        ...state,
        open: false,
    }),
}, defaultState);

export const getUpload = state => state;
export const isUploadPending = state => state.status === 'PENDING';
export const isOpen = state => state.open;

export const selectors = {
    getUpload,
    isUploadPending,
    isOpen,
};
