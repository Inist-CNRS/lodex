import expect from 'expect';
import reducer, { TOGGLE_LOGIN, LOGIN, LOGIN_SUCCESS, defaultState, toggleLogin, login, loginSuccess, isLoggedIn } from './reducers';

describe('user reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, {});
        expect(state).toEqual(defaultState);
    });

    it('should handle the TOGGLE_LOGIN action', () => {
        const state = reducer(undefined, toggleLogin());
        expect(state).toEqual({
            ...state,
            showModal: true,
        })
    });

    it('should handle the LOGIN_SUCCESS action', () => {
        const state = reducer({ showModal: true }, loginSuccess('foo'));
        expect(state).toEqual({
            showModal: false,
            token: 'foo',
        })
    });

    describe('isLoggedIn selector', () => {
        it('should return false if state has no token', () => {
            const result = isLoggedIn({ user: {} });
            expect(result).toEqual(false);
        });

        it('should return true if state has a token', () => {
            const result = isLoggedIn({ user: { token: 'foo' } });
            expect(result).toEqual(true);
        });
    });
});
