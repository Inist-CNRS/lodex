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

export type ParsingState = {
    error: Error | false;
    excerptLines: Array<Record<string, unknown>>;
    precomputed: Array<{ _id: string; status: string }>;
    initialized: boolean;
    loading: boolean;
    parsing: boolean;
    allowUpload: boolean;
    showAddFromColumn: boolean;
    totalLoadedLines: number;
    totalParsedLines: number;
};

export const defaultState: ParsingState = {
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
        LOAD_PARSING_RESULT_SUCCESS: (state, { payload }) => ({
            ...state,
            ...payload,
            allowUpload: payload.totalLoadedLines === 0,
            loading: false,
        }),
        RELOAD_PARSING_RESULT: (state) => ({
            ...state,
            allowUpload: true,
        }),
        CANCEL_RELOAD: (state) => ({
            ...state,
            allowUpload: false,
        }),
        SHOW_ADD_COLUMNS: (state) => ({ ...state, showAddFromColumn: true }),
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

export const getExcerptLines = ({ excerptLines }: ParsingState) =>
    !excerptLines || !excerptLines.length ? [] : excerptLines;

export const getParsedExcerptColumns = createSelector(
    getExcerptLines,
    (lines) => Object.keys(lines[0] || {}).filter((key) => key !== '_id'),
);

export const hasUploadedFile = ({ totalLoadedLines }: ParsingState) =>
    !!totalLoadedLines;

export const canUpload = ({ allowUpload }: ParsingState) => !!allowUpload;

export const isParsingLoading = ({ loading }: ParsingState) => loading;
export const isInitialized = ({ initialized }: ParsingState) => initialized;

export const getTotalLoadedLines = ({ totalLoadedLines }: ParsingState) =>
    totalLoadedLines;

export const getshowAddFromColumn = (state: ParsingState) =>
    state.showAddFromColumn;

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
