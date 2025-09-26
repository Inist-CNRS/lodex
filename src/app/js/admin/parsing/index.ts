// @ts-expect-error TS7016
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const LOAD_PARSING_RESULT = 'LOAD_PARSING_RESULT';
export const LOAD_PARSING_RESULT_ERROR = 'LOAD_PARSING_RESULT_ERROR';
export const LOAD_PARSING_RESULT_SUCCESS = 'LOAD_PARSING_RESULT_SUCCESS';
export const RELOAD_PARSING_RESULT = 'RELOAD_PARSING_RESULT';
export const CANCEL_RELOAD = 'CANCEL_RELOAD';
export const SHOW_ADD_COLUMNS = 'SHOW_ADD_COLUMNS';
export const HIDE_ADD_COLUMNS = 'HIDE_ADD_COLUMNS';

export const showAddFromColumn = createAction(SHOW_ADD_COLUMNS);
export const hideAddColumns = createAction(HIDE_ADD_COLUMNS);

export const defaultState = {
    error: false,
    excerptLines: [],
    precomputed: [],
    initialized: false,
    loading: false,
    parsing: false,
    allowUpload: true,
    showAddFromColumn: false,
    totalLoadedLines: 0,
    totalParsedLines: 0,
};

export default handleActions(
    {
        // @ts-expect-error TS7006
        LOAD_PARSING_RESULT: (state) => ({
            ...state,
            allowUpload: false,
            loading: true,
            initialized: true,
        }),
        // @ts-expect-error TS7006
        LOAD_PARSING_RESULT_ERROR: (state, { payload }) => ({
            ...state,
            loading: false,
            allowUpload: true,
            error: payload,
        }),
        // @ts-expect-error TS7006
        LOAD_PARSING_RESULT_SUCCESS: (state, { payload }) => ({
            ...state,
            ...payload,
            allowUpload: payload.totalLoadedLines === 0,
            loading: false,
        }),
        // @ts-expect-error TS7006
        RELOAD_PARSING_RESULT: (state) => ({
            ...state,
            allowUpload: true,
        }),
        // @ts-expect-error TS7006
        CANCEL_RELOAD: (state) => ({
            ...state,
            allowUpload: false,
        }),
        // @ts-expect-error TS7006
        SHOW_ADD_COLUMNS: (state) => ({ ...state, showAddFromColumn: true }),
        // @ts-expect-error TS7006
        HIDE_ADD_COLUMNS: (state) => ({ ...state, showAddFromColumn: false }),
    },
    defaultState,
);

export const loadParsingResult = createAction(LOAD_PARSING_RESULT);
export const loadParsingResultError = createAction(LOAD_PARSING_RESULT_ERROR);
export const loadParsingResultSuccess = createAction(
    LOAD_PARSING_RESULT_SUCCESS,
);
export const reloadParsingResult = createAction(RELOAD_PARSING_RESULT);
export const cancelReload = createAction(CANCEL_RELOAD);

// @ts-expect-error TS7031
export const getExcerptLines = ({ excerptLines }) =>
    !excerptLines || !excerptLines.length ? [] : excerptLines;

export const getParsedExcerptColumns = createSelector(
    getExcerptLines,
    (lines) => Object.keys(lines[0] || {}).filter((key) => key !== '_id'),
);

// @ts-expect-error TS7031
export const hasUploadedFile = ({ totalLoadedLines }) => !!totalLoadedLines;

// @ts-expect-error TS7031
export const canUpload = ({ allowUpload }) => !!allowUpload;

// @ts-expect-error TS7031
export const isParsingLoading = ({ loading }) => loading;
// @ts-expect-error TS7031
export const isInitialized = ({ initialized }) => initialized;

// @ts-expect-error TS7031
export const getTotalLoadedLines = ({ totalLoadedLines }) => totalLoadedLines;

// @ts-expect-error TS7006
export const getshowAddFromColumn = (state) => state.showAddFromColumn;

export const selectors = {
    getExcerptLines,
    getParsedExcerptColumns,
    hasUploadedFile,
    canUpload,
    isParsingLoading,
    isInitialized,
    getTotalLoadedLines,
    showAddFromColumn: getshowAddFromColumn,
};
