// @ts-expect-error TS7016
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
            // @ts-expect-error TS7006
            state,
            // @ts-expect-error TS7031
            { payload: { leftMenu, rightMenu, advancedMenu, customRoutes } },
        ) => ({
            ...state,
            leftMenu,
            rightMenu,
            advancedMenu,
            customRoutes,
            error: null,
        }),
        // @ts-expect-error TS7006
        [LOAD_MENU_ERROR]: (state, { payload: { error } }) => ({
            ...state,
            error,
        }),
    },
    initialState,
);

// @ts-expect-error TS7006
export const hasMenu = (state) => state;

// @ts-expect-error TS7006
const getLeftMenu = (state) => state.leftMenu;
// @ts-expect-error TS7006
const getRightMenu = (state) => state.rightMenu;
// @ts-expect-error TS7006
const getAdvancedMenu = (state) => state.advancedMenu;
// @ts-expect-error TS7006
const getCustomRoutes = (state) => state.customRoutes;
// @ts-expect-error TS7006
const getAdvancedMenuButton = (state) => state.advancedMenuButton;

export const fromMenu = {
    hasMenu,
    getLeftMenu,
    getRightMenu,
    getAdvancedMenu,
    getCustomRoutes,
    getAdvancedMenuButton,
};
