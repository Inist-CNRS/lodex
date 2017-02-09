import React from 'react';

import Resource from './Resource';

const EditResource = () => (
    <Resource mode="edit" />
);

const HideResource = () => (
    <Resource mode="hide" />
);

export default [
    {
        path: '/resource',
        component: Resource,
    },
    {
        path: '/resource/edit',
        component: EditResource,
    },
    {
        path: '/resource/hide',
        component: HideResource,
    },
    {
        path: '/resource/ark:/:naan/:rest',
        component: Resource,
    },
];
