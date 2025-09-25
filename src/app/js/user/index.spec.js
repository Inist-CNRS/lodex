import { ADMIN_ROLE, USER_ROLE } from '../../../common/tools/tenantTools';
import reducer, {
    defaultState,
    getToken,
    isAdmin,
    loginSuccess,
    logout,
    toggleLogin,
    getRequest,
    getDumpDatasetRequest,
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
            loginSuccess({ token: 'foo', role: ADMIN_ROLE }),
        );
        expect(state).toEqual({
            showModal: false,
            token: 'foo',
            role: ADMIN_ROLE,
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
            role: null,
        });
    });

    describe('isAdmin selector', () => {
        it('should return false if state has no role', () => {
            const result = isAdmin({});
            expect(result).toBe(false);
        });

        it('should return false if state role is not admin', () => {
            const result = isAdmin({ role: USER_ROLE });
            expect(result).toBe(false);
        });

        it('should return true if state role is admin', () => {
            const result = isAdmin({ role: ADMIN_ROLE });
            expect(result).toBe(true);
        });
    });

    describe('getToken selector', () => {
        it('should return the token from state', () => {
            const result = getToken({ token: 'foo' });
            expect(result).toBe('foo');
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

    describe('getDumpDatasetRequest selector', () => {
        it('should select the dump dataset request with given token, and fields', () => {
            const result = getDumpDatasetRequest({ token: 'token' }, [
                'field1',
                'field2',
                'field3',
            ]);
            expect(result).toEqual({
                url: '/api/dump?fields%5B%5D=field1&fields%5B%5D=field2&fields%5B%5D=field3',
                method: 'GET',
                credentials: 'same-origin',
                body: undefined,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer token',
                    Cookie: undefined,
                },
            });
        });

        it('should escape special characters in field names', () => {
            const result = getDumpDatasetRequest({ token: 'token' }, [
                'field & cie',
                'another field',
                '== field ==',
                'field/with/slash',
                'field?with?question',
                'field+with+plus',
                'field,with,comma',
                'field%with%percent',
                'field#with#hash',
            ]);
            console.log(result.url);
            expect(result).toEqual({
                url: '/api/dump?fields%5B%5D=field+%26+cie&fields%5B%5D=another+field&fields%5B%5D=%3D%3D+field+%3D%3D&fields%5B%5D=field%2Fwith%2Fslash&fields%5B%5D=field%3Fwith%3Fquestion&fields%5B%5D=field%2Bwith%2Bplus&fields%5B%5D=field%2Cwith%2Ccomma&fields%5B%5D=field%25with%25percent&fields%5B%5D=field%23with%23hash',
                method: 'GET',
                credentials: 'same-origin',
                body: undefined,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer token',
                    Cookie: undefined,
                },
            });
        });
    });
});
