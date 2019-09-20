import { createAction, handleActions } from 'redux-actions';

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
            { payload: { leftMenu, rightMenu, advancedMenu, customRoutes } },
        ) => ({
            ...state,
            leftMenu,
            rightMenu,
            advancedMenu,
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

const getLeftMenu = state => state.leftMenu;
const getRightMenu = state => state.rightMenu;
const getAdvancedMenu = state => state.advancedMenu;
const getCustomRoutes = state => state.customRoutes;

export const fromMenu = {
    hasMenu,
    getLeftMenu,
    getRightMenu,
    getAdvancedMenu,
    getCustomRoutes,
};
