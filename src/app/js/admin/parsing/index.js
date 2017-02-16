import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const LOAD_PARSING_RESULT = 'LOAD_PARSING_RESULT';
export const LOAD_PARSING_RESULT_ERROR = 'LOAD_PARSING_RESULT_ERROR';
export const LOAD_PARSING_RESULT_SUCCESS = 'LOAD_PARSING_RESULT_SUCCESS';
export const CLEAR_PARSING = 'CLEAR_PARSING';

export const defaultState = {
    error: false,
    excerptLines: [],
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

export const getExcerptLines = (state) => {
    if (!state || !state.parsing || !state.parsing.excerptLines || !state.parsing.excerptLines.length) return [];

    return state.parsing.excerptLines;
};

export const getParsedExcerptColumns = createSelector(
    getExcerptLines,
    lines => Object.keys(lines[0] || {}).filter(key => key !== '_id'),
);

export const hasUploadedFile = state => state && state.parsing && !!state.parsing.totalLoadedLines;

export const isParsingLoading = state => state.parsing.loading;
export const getParsingSummary = state => ({
    totalLoadedLines: state.parsing.totalLoadedLines,
    totalFailedLines: state.parsing.totalFailedLines,
    totalParsedLines: state.parsing.totalParsedLines,
});
