import Admin from './Admin';
import { isLoggedIn as selectIsLoggedIn } from '../user';

export const onEnterWithAuthenticationCheck = store => (nextState, replaceState) => {
    const state = store.getState();
    const isLoggedIn = selectIsLoggedIn(state);

    if (!isLoggedIn) {
        replaceState({ pathname: '/login', state: { nextPathname: nextState.location.pathname } });
    }
};

export default store => [{
    path: '/admin',
    component: Admin,
    onEnter: onEnterWithAuthenticationCheck(store),
}];
