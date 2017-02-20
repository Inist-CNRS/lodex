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

export const getExcerptLines = ({ excerptLines }) => (
    (!excerptLines || !excerptLines.length)
    ? []
    : excerptLines
);

export const getParsedExcerptColumns = createSelector(
    getExcerptLines,
    lines => Object.keys(lines[0] || {}).filter(key => key !== '_id'),
);

export const hasUploadedFile = ({ totalLoadedLines }) => !!totalLoadedLines;

export const isParsingLoading = ({ loading }) => loading;

export const getTotalLoadedLines = ({ totalLoadedLines }) => totalLoadedLines;

export const selectors = {
    getExcerptLines,
    getParsedExcerptColumns,
    hasUploadedFile,
    isParsingLoading,
    getTotalLoadedLines,
};
