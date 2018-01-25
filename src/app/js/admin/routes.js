import App from './App';
import Admin from './Admin';
import ContributedResourcePage from './contributedResources/ContributedResourcePage';
import RemovedResourcePage from './removedResources/RemovedResourcePage';
import { fromUser } from '../sharedSelectors';
import userRoutes from '../user/routes';
import Ontology from '../fields/ontology/Ontology';

export const onEnterWithAuthenticationCheck = store => (
    nextState,
    replaceState,
) => {
    const state = store.getState();
    const isAdmin = fromUser.isAdmin(state);

    if (!isAdmin) {
        replaceState({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname },
        });
    }
};

export default store => ({
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/dashboard') },
    childRoutes: [
        {
            path: '/dashboard',
            component: Admin,
            onEnter: onEnterWithAuthenticationCheck(store),
        },
        {
            path: '/contributions',
            component: ContributedResourcePage,
            onEnter: onEnterWithAuthenticationCheck(store),
        },
        {
            path: '/removed',
            component: RemovedResourcePage,
            onEnter: onEnterWithAuthenticationCheck(store),
        },
        {
            path: '/ontology',
            component: Ontology,
            onEnter: onEnterWithAuthenticationCheck(store),
        },
        ...userRoutes,
    ],
});
