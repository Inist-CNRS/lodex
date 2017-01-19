import { createAction, handleActions } from 'redux-actions';

export const SIGN_IN_FORM_NAME = 'signIn';
export const TOGGLE_SIGN_IN = 'TOGGLE_SIGN_IN';
export const SIGN_IN = 'SIGN_IN';
export const defaultState = { showModal: false, token: null };

export default handleActions({
    TOGGLE_SIGN_IN: state => ({
        ...state,
        showModal: !state.showModal,
    }),
}, defaultState);

export const toggleSignIn = createAction(TOGGLE_SIGN_IN);
export const signIn = createAction(SIGN_IN);

export const isSignedIn = state => !!state.user.token;
