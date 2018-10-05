import reducer, {
    defaultState,
    getToken,
    isAdmin,
    loginSuccess,
    logout,
    toggleLogin,
    getRequest,
} from './';

describe('user reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle the TOGGLE_LOGIN action', () => {
        const state = reducer(undefined, toggleLogin());
        expect(state).toEqual({
            ...state,
            showModal: true,
        });
    });

    it('should handle the LOGIN_SUCCESS action', () => {
        const state = reducer(
            { showModal: true },
            loginSuccess({ token: 'foo', role: 'admin' }),
        );
        expect(state).toEqual({
            showModal: false,
            token: 'foo',
            role: 'admin',
        });
    });

    it('should handle the LOGOUT action', () => {
        const state = reducer(
            { showModal: false, token: 'C3PO&R2D2' },
            logout(),
        );
        expect(state).toEqual({
            showModal: true,
            token: null,
        });
    });

    describe('isAdmin selector', () => {
        it('should return false if state has no role', () => {
            const result = isAdmin({});
            expect(result).toEqual(false);
        });

        it('should return false if state role is not admin', () => {
            const result = isAdmin({ role: 'user' });
            expect(result).toEqual(false);
        });

        it('should return true if state role is admin', () => {
            const result = isAdmin({ role: 'admin' });
            expect(result).toEqual(true);
        });
    });

    describe('getToken selector', () => {
        it('should return the token from state', () => {
            const result = getToken({ token: 'foo' });
            expect(result).toEqual('foo');
        });
    });

    describe('getRequest selector', () => {
        it('should select config request with given token, url, body and method', () => {
            const result = getRequest(
                { token: 'token' },
                { url: 'url', method: 'method', body: { data: 'value' } },
            );
            expect(result).toEqual({
                url: 'url',
                body: '{"data":"value"}',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer token',
                    Cookie: undefined,
                },
                method: 'method',
            });
        });
    });
});
