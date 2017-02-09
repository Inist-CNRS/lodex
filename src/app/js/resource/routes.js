import React from 'react';

import Resource from './Resource';

const EditResource = () => (
    <Resource edit />
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
        path: '/resource/ark:/:naan/:rest',
        component: Resource,
    },
];
