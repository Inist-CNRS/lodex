import { createAction, handleActions, combineActions } from 'redux-actions';

export const UPLOAD_FILE = 'UPLOAD_FILE';
export const UPLOAD_URL = 'UPLOAD_URL';
export const UPLOAD_TEXT = 'UPLOAD_TEXT';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const OPEN_UPLOAD = 'OPEN_UPLOAD';
export const CLOSE_UPLOAD = 'CLOSE_UPLOAD';
export const CHANGE_UPLOAD_URL = 'CHANGE_UPLOAD_URL';
export const CHANGE_UPLOAD_TEXT = 'CHANGE_UPLOAD_TEXT';
export const CHANGE_LOADER_NAME = 'CHANGE_LOADER_NAME';

export const UPSERT_CUSTOM_LOADER = 'UPSERT_CUSTOM_LOADER';
export const DELETE_CUSTOM_LOADER = 'DELETE_CUSTOM_LOADER';

export const uploadFile = createAction(UPLOAD_FILE);
export const uploadUrl = createAction(UPLOAD_URL);
export const uploadText = createAction(UPLOAD_TEXT);
export const uploadSuccess = createAction(UPLOAD_SUCCESS);
export const uploadError = createAction(UPLOAD_ERROR);
export const openUpload = createAction(OPEN_UPLOAD);
export const closeUpload = createAction(CLOSE_UPLOAD);
export const changeUploadUrl = createAction(CHANGE_UPLOAD_URL);
export const changeUploadText = createAction(CHANGE_UPLOAD_TEXT);
export const changeLoaderName = createAction(CHANGE_LOADER_NAME);

export const upsertCustomLoader = createAction(UPSERT_CUSTOM_LOADER);
export const deleteCustomLoader = createAction(DELETE_CUSTOM_LOADER);

// @ts-expect-error TS7006
const validateUrl = (url) =>
    url && (url.startsWith('http://') || url.startsWith('https://'));

export const defaultState = {
    error: false,
    status: 'NONE',
    open: false,
    isUrlValid: false,
    url: '',
    loaderName: null,
    customLoader: null,
};

// @ts-expect-error TS2769
export default handleActions(
    {
        // @ts-expect-error TS2464
        [combineActions(UPLOAD_FILE, UPLOAD_URL, UPLOAD_TEXT)]: (
            // @ts-expect-error TS7006
            state,
            // @ts-expect-error TS7031
            { payload },
        ) =>
            payload
                ? {
                      ...state,
                      error: false,
                      open: false,
                      status: 'PENDING',
                  }
                : state,
        UPLOAD_SUCCESS: (state) => ({
            ...state,
            status: 'SUCCESS',
        }),
        UPLOAD_ERROR: (state, { payload }) => ({
            ...state,
            status: 'ERROR',
            // @ts-expect-error TS2339
            error: payload.message,
        }),
        OPEN_UPLOAD: (state) => ({
            ...state,
            open: true,
        }),
        CLOSE_UPLOAD: (state) => ({
            ...state,
            open: false,
        }),
        CHANGE_UPLOAD_URL: (state, { payload: url }) => ({
            ...state,
            url,
            validUrl: validateUrl(url),
        }),
        CHANGE_UPLOAD_TEXT: (state, { payload: textContent }) => ({
            ...state,
            textContent,
        }),
        CHANGE_LOADER_NAME: (state, { payload: loaderName }) => ({
            ...state,
            loaderName,
        }),
        UPSERT_CUSTOM_LOADER: (state, { payload: customLoader }) => ({
            ...state,
            customLoader,
        }),
        DELETE_CUSTOM_LOADER: (state) => ({
            ...state,
            customLoader: null,
        }),
    },
    defaultState,
);

// @ts-expect-error TS7006
export const getUpload = (state) => state;
// @ts-expect-error TS7006
export const isUploadPending = (state) => state.status === 'PENDING';
// @ts-expect-error TS7006
export const isOpen = (state) => state.open;
// @ts-expect-error TS7031
export const getUrl = ({ url }) => url;
// @ts-expect-error TS7031
export const getTextContent = ({ textContent }) => textContent;
// @ts-expect-error TS7031
export const getLoaderName = ({ loaderName }) => loaderName;
// @ts-expect-error TS7031
export const isUrlValid = ({ validUrl }) => validUrl;
// @ts-expect-error TS7031
export const getCustomLoader = ({ customLoader }) => customLoader;

export const selectors = {
    getUpload,
    isUploadPending,
    isOpen,
    getUrl,
    getTextContent,
    getLoaderName,
    isUrlValid,
    getCustomLoader,
};
