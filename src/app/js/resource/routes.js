import React from 'react';
import routerPropTypes from 'react-router/lib/PropTypes';

import Resource from './Resource';

const Ark = ({ routeParams: { naan, rest } }) => (
    <Resource uri={`${naan}/${rest}`} />
);

Ark.propTypes = routerPropTypes;

const Uri = ({ location: { query: { uri } } }) => (
    <Resource uri={uri} />
);

Uri.propTypes = routerPropTypes;

export default [
    {
        path: '/resource',
        component: Uri,
    },
    {
        path: '/resource/ark:/:naan/:rest',
        component: Ark,
    },
];
