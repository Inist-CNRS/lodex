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
    displayExportPDF: null,
    maxExportPDFSize: null,
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

export const hasDisplayConfig = state => state;

const isDense = state => state.displayDensity === 'dense';
const getDisplayExportPDF = state => state.displayExportPDF || false;
const getMaxExportPDFSize = state => state.maxExportPDFSize || 0;

export const fromDisplayConfig = {
    hasDisplayConfig,
    getDisplayExportPDF,
    getMaxExportPDFSize,
    isDense,
};
