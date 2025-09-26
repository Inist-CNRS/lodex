import { createAction, handleActions } from 'redux-actions';

export const LOAD_DISPLAY_CONFIG = 'LOAD_DISPLAY_CONFIG';
export const LOAD_DISPLAY_CONFIG_SUCCESS = 'LOAD_DISPLAY_CONFIG_SUCCESS';
export const LOAD_DISPLAY_CONFIG_ERROR = 'LOAD_DISPLAY_CONFIG_ERROR';

export const loadDisplayConfig = createAction(LOAD_DISPLAY_CONFIG);
export const loadDisplayConfigSuccess = createAction(
    LOAD_DISPLAY_CONFIG_SUCCESS,
);
export const loadDisplayConfigError = createAction(LOAD_DISPLAY_CONFIG_ERROR);

export const initialState = {
    error: null,
    displayDensity: null,
    PDFExportOptions: null,
    maxCheckAllFacetsValues: null,
};

export const DEFAULT_MAX_VALUE_FOR_CHECK_ALL_FACET = {
    dataset: 60,
    search: 300,
};

export default handleActions(
    {
        [LOAD_DISPLAY_CONFIG_SUCCESS]: (
            state,
            { payload: { displayDensity } },
        ) => ({
            ...state,
            displayDensity,
            error: null,
        }),
        [LOAD_DISPLAY_CONFIG_ERROR]: (state, { payload: { error } }) => ({
            ...state,
            error,
        }),
    },
    initialState,
);

// @ts-expect-error TS7006
export const hasDisplayConfig = (state) => state;

// @ts-expect-error TS7006
const isDense = (state) => state.displayDensity === 'dense';
// @ts-expect-error TS7006
const getDisplayExportPDF = (state) => state.PDFExportOptions?.display || false;
// @ts-expect-error TS7006
const getMaxExportPDFSize = (state) => state.PDFExportOptions?.maxSize || 0;
// @ts-expect-error TS7006
const getMaxCheckAllFacetsValue = (state) =>
    state.maxCheckAllFacetsValue || DEFAULT_MAX_VALUE_FOR_CHECK_ALL_FACET;
// @ts-expect-error TS7006
const isMultilingual = (state) => state.multilingual;

export const fromDisplayConfig = {
    hasDisplayConfig,
    getDisplayExportPDF,
    getMaxExportPDFSize,
    getMaxCheckAllFacetsValue,
    isDense,
    isMultilingual,
};
