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

export const uploadFile = createAction<unknown>(UPLOAD_FILE);
export const uploadUrl = createAction<unknown>(UPLOAD_URL);
export const uploadText = createAction<unknown>(UPLOAD_TEXT);
export const uploadSuccess = createAction<void>(UPLOAD_SUCCESS);
export const uploadError = createAction<Error>(UPLOAD_ERROR);
export const openUpload = createAction<void>(OPEN_UPLOAD);
export const closeUpload = createAction<void>(CLOSE_UPLOAD);
export const changeUploadUrl = createAction<string>(CHANGE_UPLOAD_URL);
export const changeUploadText = createAction<string>(CHANGE_UPLOAD_TEXT);
export const changeLoaderName = createAction<string>(CHANGE_LOADER_NAME);

export const upsertCustomLoader = createAction<string>(UPSERT_CUSTOM_LOADER);
export const deleteCustomLoader = createAction<void>(DELETE_CUSTOM_LOADER);

const validateUrl = (url: string): boolean =>
    !!(url && (url.startsWith('http://') || url.startsWith('https://')));

type UploadState = {
    error: boolean | string;
    status: 'NONE' | 'PENDING' | 'SUCCESS' | 'ERROR';
    open: boolean;
    isUrlValid: boolean;
    url: string;
    loaderName: string | null;
    customLoader: string | null;
    textContent?: string;
};

export const defaultState: UploadState = {
    error: false,
    status: 'NONE',
    open: false,
    isUrlValid: false,
    url: '',
    loaderName: null,
    customLoader: null,
};

export default handleActions<UploadState, any>(
    {
        [combineActions(
            UPLOAD_FILE,
            UPLOAD_URL,
            UPLOAD_TEXT,
        ) as unknown as string]: (state, { payload }: { payload: unknown }) =>
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
        UPLOAD_ERROR: (
            state,
            {
                payload,
            }: {
                payload: Error;
            },
        ) => ({
            ...state,
            status: 'ERROR',
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
        CHANGE_UPLOAD_URL: (
            state,
            { payload: url }: { payload: string },
        ): UploadState => ({
            ...state,
            url,
            isUrlValid: validateUrl(url),
        }),
        CHANGE_UPLOAD_TEXT: (
            state,
            {
                payload: textContent,
            }: {
                payload: string;
            },
        ) => ({
            ...state,
            textContent,
        }),
        CHANGE_LOADER_NAME: (
            state,
            {
                payload: loaderName,
            }: {
                payload: string;
            },
        ) => ({
            ...state,
            loaderName,
        }),
        UPSERT_CUSTOM_LOADER: (
            state,
            {
                payload: customLoader,
            }: {
                payload: string;
            },
        ) => ({
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

export const getUpload = (state: UploadState) => state;
export const isUploadPending = (state: UploadState) =>
    state.status === 'PENDING';
export const isOpen = (state: UploadState) => state.open;
export const getUrl = ({ url }: UploadState) => url;
export const getTextContent = ({ textContent }: UploadState) => textContent;
export const getLoaderName = ({ loaderName }: UploadState) => loaderName;
export const isUrlValid = ({ isUrlValid }: UploadState) => isUrlValid;
export const getCustomLoader = ({ customLoader }: UploadState) => customLoader;

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
