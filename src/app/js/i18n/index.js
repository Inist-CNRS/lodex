import { createAction, handleActions } from 'redux-actions';

export const SUPPORTED_LANGUAGES = ['en', 'fr'];

export const INITIALIZE_LANGUAGE = 'INITIALIZE_LANGUAGE';
export const SET_LANGUAGE_REQUEST = 'SET_LANGUAGE_REQUEST';
export const SET_LANGUAGE_REQUEST_SUCCESS = 'SET_LANGUAGE_REQUEST_SUCCESS';
export const SET_LANGUAGE_REQUEST_ERROR = 'SET_LANGUAGE_REQUEST_ERROR';

export const initializeLanguage = createAction(INITIALIZE_LANGUAGE);
export const setLanguage = createAction(SET_LANGUAGE_REQUEST);
export const setLanguageSuccess = createAction(SET_LANGUAGE_REQUEST_SUCCESS);
export const setLanguageError = createAction(SET_LANGUAGE_REQUEST_ERROR);

export const defaultState = {
    error: null,
    language: 'en',
    loading: false,
};

export default handleActions(
    {
        SET_LANGUAGE_REQUEST: (state) => ({
            ...state,
            loading: true,
        }),
        SET_LANGUAGE_REQUEST_SUCCESS: (state, { payload: language }) => ({
            ...state,
            language,
            loading: false,
        }),
        SET_LANGUAGE_REQUEST_ERROR: (state, { payload: error }) => ({
            ...state,
            error,
            loading: false,
        }),
    },
    defaultState,
);

const getLocale = (state) => state.language;

export const fromI18n = {
    getLocale,
};
