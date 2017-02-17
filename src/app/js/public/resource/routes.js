import React from 'react';

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

const EditResource = () => (
    <Resource mode="edit" />
);

const HideResource = () => (
    <Resource mode="hide" />
);

const RemovedResource = () => (
    <Resource mode="removed" />
);

const AddFieldResource = () => (
    <Resource mode="add-field" />
);

export default store => [
    {
        path: '/resource',
        component: Resource,
    },
    {
        path: '/resource/edit',
        component: EditResource,
        onEnter: onEnterWithAuthenticationCheck(store),
    },
    {
        path: '/resource/hide',
        component: HideResource,
        onEnter: onEnterWithAuthenticationCheck(store),
    },
    {
        path: '/resource/removed',
        component: RemovedResource,
        onEnter: onEnterWithAuthenticationCheck(store),
    },
    {
        path: '/resource/add-field',
        component: AddFieldResource,
    },
    {
        path: '/resource/ark:/:naan/:rest',
        component: Resource,
    },
];
