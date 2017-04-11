import App from './App';
import Admin from './Admin';
import ContributedResourcePage from './contributedResources/ContributedResourcePage';
import RemovedResourcePage from './removedResources/RemovedResourcePage';
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
    path: '/admin',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/admin/dashboard') },
    childRoutes: [
        {
            path: '/admin/dashboard',
            component: Admin,
            onEnter: onEnterWithAuthenticationCheck(store),
        },
        {
            path: '/admin/contributions',
            component: ContributedResourcePage,
            onEnter: onEnterWithAuthenticationCheck(store),
        },
        {
            path: '/admin/removed',
            component: RemovedResourcePage,
            onEnter: onEnterWithAuthenticationCheck(store),
        },
        ...userRoutes,
    ],
});
