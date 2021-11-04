import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const LOAD_PARSING_RESULT = 'LOAD_PARSING_RESULT';
export const LOAD_PARSING_RESULT_ERROR = 'LOAD_PARSING_RESULT_ERROR';
export const LOAD_PARSING_RESULT_SUCCESS = 'LOAD_PARSING_RESULT_SUCCESS';
export const RELOAD_PARSING_RESULT = 'RELOAD_PARSING_RESULT';
export const CANCEL_RELOAD = 'CANCEL_RELOAD';
export const SHOW_ADD_COLUMNS = 'SHOW_ADD_COLUMNS';
export const HIDE_ADD_COLUMNS = 'HIDE_ADD_COLUMNS';
export const TOGGLE_LOADED_COLUMN = 'TOGGLE_LOADED_COLUMN';
export const TOGGLE_ENRICHED_COLUMN = 'TOGGLE_ENRICHED_COLUMN';

export const showAddColumns = createAction(SHOW_ADD_COLUMNS);
export const hideAddColumns = createAction(HIDE_ADD_COLUMNS);
export const toggleLoadedColumn = createAction(TOGGLE_LOADED_COLUMN);
export const toggleEnrichedColumn = createAction(TOGGLE_ENRICHED_COLUMN);

export const defaultState = {
    error: false,
    excerptLines: [],
    loading: false,
    parsing: false,
    allowUpload: true,
    showAddColumns: false,
    totalLoadedLines: 0,
    totalParsedLines: 0,
    hideLoadedColumn: false,
    hideEnrichedColumn: false,
};

export default handleActions(
    {
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
        SHOW_ADD_COLUMNS: state => ({ ...state, showAddColumns: true }),
        HIDE_ADD_COLUMNS: state => ({ ...state, showAddColumns: false }),
        TOGGLE_LOADED_COLUMN: state => ({
            ...state,
            hideLoadedColumn: !state.hideLoadedColumn,
        }),
        TOGGLE_ENRICHED_COLUMN: state => ({
            ...state,
            hideEnrichedColumn: !state.hideEnrichedColumn,
        }),
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

export const getExcerptLines = ({ excerptLines }) =>
    !excerptLines || !excerptLines.length ? [] : excerptLines;

export const getParsedExcerptColumns = createSelector(getExcerptLines, lines =>
    Object.keys(lines[0] || {}).filter(key => key !== '_id'),
);

export const hasUploadedFile = ({ totalLoadedLines }) => !!totalLoadedLines;

export const canUpload = ({ allowUpload }) => !!allowUpload;

export const isParsingLoading = ({ loading }) => loading;

export const getTotalLoadedLines = ({ totalLoadedLines }) => totalLoadedLines;

export const getShowAddColumns = state => state.showAddColumns;
export const getHideLoadedColumn = state => state.hideLoadedColumn;
export const getHideEnrichedColumn = state => state.hideEnrichedColumn;

export const selectors = {
    getExcerptLines,
    getParsedExcerptColumns,
    hasUploadedFile,
    canUpload,
    isParsingLoading,
    getTotalLoadedLines,
    showAddColumns: getShowAddColumns,
    getHideLoadedColumn,
    getHideEnrichedColumn,
};
