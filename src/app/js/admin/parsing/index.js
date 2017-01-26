import { createAction, handleActions } from 'redux-actions';

export const LOAD_PARSING_RESULT = 'LOAD_PARSING_RESULT';
export const LOAD_PARSING_RESULT_ERROR = 'LOAD_PARSING_RESULT_ERROR';
export const LOAD_PARSING_RESULT_SUCCESS = 'LOAD_PARSING_RESULT_SUCCESS';
export const CLEAR_PARSING = 'CLEAR_PARSING';

export const defaultState = {
    error: false,
    excerptLines: [],
    failedLines: [],
    loading: false,
    parsing: false,
    totalLoadedLines: 0,
    totalParsedLines: 0,
};

export default handleActions({
    LOAD_PARSING_RESULT: state => ({
        ...state,
        loading: true,
    }),
    LOAD_PARSING_RESULT_ERROR: (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
    }),
    LOAD_PARSING_RESULT_SUCCESS: (state, { payload }) => ({
        ...state,
        ...payload,
        loading: false,
    }),
    CLEAR_PARSING: () => defaultState,
}, defaultState);

export const loadParsingResult = createAction(LOAD_PARSING_RESULT);
export const loadParsingResultError = createAction(LOAD_PARSING_RESULT_ERROR);
export const loadParsingResultSuccess = createAction(LOAD_PARSING_RESULT_SUCCESS);
export const clearParsing = createAction(CLEAR_PARSING);

export const getParsedExcerptColumns = (state) => {
    if (!state || !state.parsing || !state.parsing.excerptLines || !state.parsing.excerptLines.length) return [];

    return Object.keys(state.parsing.excerptLines[0]);
};

export const hasUploadedFile = state => state && state.parsing && state.parsing.totalLoadedLines;

export const getLoadParsingResultRequest = state => ({
    url: '/api/parsing',
    credentials: 'include',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.user.token}`,
        'Content-Type': 'application/json',
    },
});
