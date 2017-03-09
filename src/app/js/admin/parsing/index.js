import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const LOAD_PARSING_RESULT = 'LOAD_PARSING_RESULT';
export const LOAD_PARSING_RESULT_ERROR = 'LOAD_PARSING_RESULT_ERROR';
export const LOAD_PARSING_RESULT_SUCCESS = 'LOAD_PARSING_RESULT_SUCCESS';
export const RELOAD_PARSING_RESULT = 'RELOAD_PARSING_RESULT';
export const CANCEL_RELOAD = 'CANCEL_RELOAD';

export const defaultState = {
    error: false,
    excerptLines: [],
    loading: false,
    parsing: false,
    allowUpload: true,
    totalLoadedLines: 0,
    totalParsedLines: 0,
};

export default handleActions({
    LOAD_PARSING_RESULT: state => ({
        ...state,
        allowUpload: false,
        loading: true,
    }),
    LOAD_PARSING_RESULT_ERROR: (state, { payload }) => ({
        ...state,
        loading: false,
        allowUpload: true,
        error: payload,
    }),
    LOAD_PARSING_RESULT_SUCCESS: (state, { payload }) => ({
        ...state,
        ...payload,
        allowUpload: payload.totalLoadedLines === 0,
        loading: false,
    }),
    RELOAD_PARSING_RESULT: state => ({
        ...state,
        allowUpload: true,
    }),
    CANCEL_RELOAD: state => ({
        ...state,
        allowUpload: false,
    }),
}, defaultState);

export const loadParsingResult = createAction(LOAD_PARSING_RESULT);
export const loadParsingResultError = createAction(LOAD_PARSING_RESULT_ERROR);
export const loadParsingResultSuccess = createAction(LOAD_PARSING_RESULT_SUCCESS);
export const reloadParsingResult = createAction(RELOAD_PARSING_RESULT);
export const cancelReload = createAction(CANCEL_RELOAD);

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

export const canUpload = ({ allowUpload }) => !!allowUpload;

export const isParsingLoading = ({ loading }) => loading;

export const getTotalLoadedLines = ({ totalLoadedLines }) => totalLoadedLines;

export const selectors = {
    getExcerptLines,
    getParsedExcerptColumns,
    hasUploadedFile,
    canUpload,
    isParsingLoading,
    getTotalLoadedLines,
};
