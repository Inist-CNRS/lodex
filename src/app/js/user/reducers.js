import { createAction, handleActions } from 'redux-actions';

export const LOGIN_FORM_NAME = 'login';
export const TOGGLE_LOGIN = 'TOGGLE_LOGIN';
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const defaultState = { showModal: false, token: null };

export default handleActions({
    TOGGLE_LOGIN: state => ({
        ...state,
        showModal: !state.showModal,
    }),
    LOGIN_SUCCESS: (state, { payload }) => ({
        ...state,
        showModal: false,
        token: payload,
    }),
}, defaultState);

export const toggleLogin = createAction(TOGGLE_LOGIN);
export const login = createAction(LOGIN);
export const loginSuccess = createAction(LOGIN_SUCCESS);

export const isLoggedIn = state => !!state.user.token;
