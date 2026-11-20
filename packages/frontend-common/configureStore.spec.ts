import { createMemoryHistory } from 'history';

import configureStore from './configureStore';
import { getUserSessionStorageInfo } from './getUserSessionStorageInfo';
import userReducer, { loginSuccess, logout } from './user/reducer';

// defined by the bundler
// @ts-expect-error TS7017
global.__DEBUG__ = false;

type State = { user: { token: string | null } };

const getStore = (tenant: string) => {
    // @ts-expect-error TS2339
    window.__TENANT__ = tenant;
    return configureStore(
        { user: userReducer },
        function* () {},
        {},
        createMemoryHistory(),
    ).store;
};

describe('configureStore', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    afterEach(() => {
        // @ts-expect-error TS2339
        delete window.__TENANT__;
    });

    it('should keep the session of an instance when another one logs out', () => {
        const storeA = getStore('instance-a');
        storeA.dispatch(loginSuccess({ token: 'token-a', role: 'admin' }));

        // another tab, on another instance of the same domain
        const storeB = getStore('instance-b');
        expect((storeB.getState() as State).user.token).toBeNull();
        storeB.dispatch(logout());

        // @ts-expect-error TS2339
        window.__TENANT__ = 'instance-a';
        expect(getUserSessionStorageInfo().token).toBe('token-a');
        expect((getStore('instance-a').getState() as State).user.token).toBe(
            'token-a',
        );
    });
});
