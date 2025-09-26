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

export const hasDisplayConfig = (state) => state;

const isDense = (state) => state.displayDensity === 'dense';
const getDisplayExportPDF = (state) => state.PDFExportOptions?.display || false;
const getMaxExportPDFSize = (state) => state.PDFExportOptions?.maxSize || 0;
const getMaxCheckAllFacetsValue = (state) =>
    state.maxCheckAllFacetsValue || DEFAULT_MAX_VALUE_FOR_CHECK_ALL_FACET;
const isMultilingual = (state) => state.multilingual;

export const fromDisplayConfig = {
    hasDisplayConfig,
    getDisplayExportPDF,
    getMaxExportPDFSize,
    getMaxCheckAllFacetsValue,
    isDense,
    isMultilingual,
};
