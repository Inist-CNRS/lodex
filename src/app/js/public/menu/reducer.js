import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

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
            menu: {
                topMenu,
                bottomMenu,
                customRoutes,
            },
        }),
        [LOAD_MENU_ERROR]: (state, { payload: { error } }) => ({
            ...state,
            error,
        }),
    },
    initialState,
);

export const getMenu = state => state.menu;

const getTopMenu = createSelector(getMenu, menu => menu.topMenu);
const getBottomMenu = createSelector(getMenu, menu => menu.bottomMenu);
const getCustomRoutes = createSelector(
    getMenu,
    menu => menu && menu.customRoutes,
);

export const fromMenu = {
    getMenu,
    getTopMenu,
    getBottomMenu,
    getCustomRoutes,
};
