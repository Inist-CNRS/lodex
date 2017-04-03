import Resource from './Resource';
import { isLoggedIn as selectIsLoggedIn } from '../../user';

export const onEnterWithAuthenticationCheck = store => (nextState, replaceState) => {
    const state = store.getState();
    const isLoggedIn = selectIsLoggedIn(state);

    if (!isLoggedIn) {
        replaceState({
            pathname: '/resource',
            query: nextState.location.query,
        });
    }
};

export default () => [
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
