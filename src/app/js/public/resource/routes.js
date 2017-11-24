import Resource from './Resource';
import { fromUser } from '../../sharedSelectors';

export const onEnterWithAuthenticationCheck = store => (
    nextState,
    replaceState,
) => {
    const state = store.getState();
    const isLoggedIn = fromUser.isLoggedIn(state);

    if (!isLoggedIn) {
        replaceState({
            pathname: '/resource',
            query: nextState.location.query,
        });
    }
};

export default [
    {
        path: '/resource',
        component: Resource,
    },
    {
        path: '/ark:/:naan/:rest',
        component: Resource,
    },
    {
        path: '/uid:/:uri',
        component: Resource,
    },
];
