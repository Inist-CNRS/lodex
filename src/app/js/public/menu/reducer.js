import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import omit from 'lodash.omit';

export const LOAD_MENU = 'LOAD_MENU';
export const LOAD_MENU_SUCCESS = 'LOAD_MENU_SUCCESS';
export const LOAD_MENU_ERROR = 'LOAD_MENU_ERROR';

export const loadMenu = createAction(LOAD_MENU);
export const loadMenuSuccess = createAction(LOAD_MENU_SUCCESS);
export const loadMenuError = createAction(LOAD_MENU_ERROR);

export const initialState = {
    error: null,
    menu: null,
};

export default handleActions(
    {
        [LOAD_MENU_SUCCESS]: (
            state,
            { payload: { topMenu, bottomMenu, customRoutes } },
        ) => ({
            ...state,
            topMenu,
            bottomMenu,
            customRoutes,
            error: null,
        }),
        [LOAD_MENU_ERROR]: (state, { payload: { error } }) => ({
            ...state,
            error,
        }),
    },
    initialState,
);

export const hasMenu = state => state;

const getTopMenu = state => state.topMenu;
const getBottomMenu = state => state.bottomMenu;
const getCustomRoutes = state => state.customRoutes;

export const fromMenu = {
    hasMenu,
    getTopMenu,
    getBottomMenu,
    getCustomRoutes,
};
