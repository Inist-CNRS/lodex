import { createAction, handleActions, combineActions } from 'redux-actions';

export const UPLOAD_FILE = 'UPLOAD_FILE';
export const UPLOAD_FILE_ERROR = 'UPLOAD_FILE_ERROR';
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';
export const OPEN_UPLOAD = 'OPEN_UPLOAD';
export const CLOSE_UPLOAD = 'CLOSE_UPLOAD';
export const CHANGE_UPLOAD_URL = 'CHANGE_UPLOAD_URL';
export const UPLOAD_URL = 'UPLOAD_URL';
export const UPLOAD_URL_ERROR = 'UPLOAD_URL_ERROR';
export const UPLOAD_URL_SUCCESS = 'UPLOAD_URL_SUCCESS';

export const uploadFile = createAction(UPLOAD_FILE);
export const uploadFileSuccess = createAction(UPLOAD_FILE_SUCCESS);
export const uploadFileError = createAction(UPLOAD_FILE_ERROR);
export const openUpload = createAction(OPEN_UPLOAD);
export const closeUpload = createAction(CLOSE_UPLOAD);
export const changeUploadUrl = createAction(CHANGE_UPLOAD_URL);
export const uploadUrl = createAction(UPLOAD_URL);
export const uploadUrlSuccess = createAction(UPLOAD_URL_SUCCESS);
export const uploadUrlError = createAction(UPLOAD_URL_ERROR);

const validateUrl = url => url.startsWith('http://') || url.startsWith('https://');

export const defaultState = {
    error: false,
    status: 'NONE',
    open: false,
    url: null,
};

export default handleActions({
    [combineActions(UPLOAD_FILE, UPLOAD_URL)]: (state, { payload }) => (payload
    ? ({
        ...state,
        error: false,
        open: false,
        status: 'PENDING',
    }) : state),
    [combineActions(UPLOAD_FILE_SUCCESS, UPLOAD_URL_SUCCESS)]: state => ({
        ...state,
        status: 'SUCCESS',
    }),
    [combineActions(UPLOAD_FILE_ERROR, UPLOAD_URL_ERROR)]: (state, { payload }) => ({
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
    CHANGE_UPLOAD_URL: (state, { payload: url }) => ({
        ...state,
        url,
        validUrl: validateUrl(url),
    }),
}, defaultState);

export const getUpload = state => state;
export const isUploadPending = state => state.status === 'PENDING';
export const isOpen = state => state.open;
export const getUrl = ({ url }) => url;
export const isUrlValid = ({ validUrl }) => validUrl;

export const selectors = {
    getUpload,
    isUploadPending,
    isOpen,
    getUrl,
    isUrlValid,
};
