// @ts-expect-error TS7016
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
    locale: 'en',
    loading: false,
    phrases: [],
};

export default handleActions(
    {
        // @ts-expect-error TS7006
        SET_LANGUAGE_REQUEST: (state) => ({
            ...state,
            loading: true,
        }),
        SET_LANGUAGE_REQUEST_SUCCESS: (
            // @ts-expect-error TS7006
            state,
            // @ts-expect-error TS7031
            { payload: { locale, phrases } },
        ) => ({
            ...state,
            locale,
            phrases,
            loading: false,
        }),
        // @ts-expect-error TS7006
        SET_LANGUAGE_REQUEST_ERROR: (state, { payload: error }) => ({
            ...state,
            error,
            loading: false,
        }),
    },
    defaultState,
);

// @ts-expect-error TS7006
const getLocale = (state) => state.locale;
// @ts-expect-error TS7006
const getPhrases = (state) => state.phrases;

export const fromI18n = {
    getLocale,
    getPhrases,
};
