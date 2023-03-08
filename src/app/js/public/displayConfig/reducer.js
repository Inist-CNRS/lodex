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
    displayConfig: null,
};

export default handleActions(
    {
        [LOAD_DISPLAY_CONFIG_SUCCESS]: (
            state,
            { payload: { displayConfig } },
        ) => ({
            ...state,
            displayConfig,
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

const getDisplayConfig = state => state.displayConfig;

export const fromDisplayConfig = {
    hasDisplayConfig,
    getDisplayConfig,
};
