import App from './App';
import Admin from './Admin';
import { isLoggedIn as selectIsLoggedIn } from '../user';
import userRoutes from '../user/routes';

export const onEnterWithAuthenticationCheck = store => (nextState, replaceState) => {
    const state = store.getState();
    const isLoggedIn = selectIsLoggedIn(state);

    if (!isLoggedIn) {
        replaceState({ pathname: '/login', state: { nextPathname: nextState.location.pathname } });
    }
};


export default store => ({
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/home') },
    childRoutes: [
        {
            path: '/home',
            component: Admin,
            onEnter: onEnterWithAuthenticationCheck(store),
        },
        ...userRoutes,
    ],
});
