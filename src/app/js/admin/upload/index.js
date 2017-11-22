import { createAction, handleActions, combineActions } from 'redux-actions';

export const UPLOAD_FILE = 'UPLOAD_FILE';
export const UPLOAD_URL = 'UPLOAD_URL';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const OPEN_UPLOAD = 'OPEN_UPLOAD';
export const CLOSE_UPLOAD = 'CLOSE_UPLOAD';
export const CHANGE_UPLOAD_URL = 'CHANGE_UPLOAD_URL';
export const CHANGE_PARSER_NAME = 'CHANGE_PARSER_NAME';

export const uploadFile = createAction(UPLOAD_FILE);
export const uploadUrl = createAction(UPLOAD_URL);
export const uploadSuccess = createAction(UPLOAD_SUCCESS);
export const uploadError = createAction(UPLOAD_ERROR);
export const openUpload = createAction(OPEN_UPLOAD);
export const closeUpload = createAction(CLOSE_UPLOAD);
export const changeUploadUrl = createAction(CHANGE_UPLOAD_URL);
export const changeParserName = createAction(CHANGE_PARSER_NAME);

const validateUrl = url => url.startsWith('http://') || url.startsWith('https://');

export const defaultState = {
    error: false,
    status: 'NONE',
    open: false,
    isUrlValid: false,
    url: '',
    parserName: 'automatic',
};

export default handleActions({
    [combineActions(UPLOAD_FILE, UPLOAD_URL)]: (state, { payload }) => (payload
        ? ({
            ...state,
            error: false,
            open: false,
            status: 'PENDING',
        }) : state),
    UPLOAD_SUCCESS: state => ({
        ...state,
        status: 'SUCCESS',
    }),
    UPLOAD_ERROR: (state, { payload }) => ({
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
    CHANGE_PARSER_NAME: (state, { payload: parserName }) => ({
        ...state,
        parserName,
    }),
}, defaultState);

export const getUpload = state => state;
export const isUploadPending = state => state.status === 'PENDING';
export const isOpen = state => state.open;
export const getUrl = ({ url }) => url;
export const getParserName = ({ parserName }) => parserName;
export const isUrlValid = ({ validUrl }) => validUrl;

export const selectors = {
    getUpload,
    isUploadPending,
    isOpen,
    getUrl,
    getParserName,
    isUrlValid,
};
