import React from 'react';

import DefaultView from './DefaultView';
import DefaultEdition from './DefaultEdition';

const Empty = () => <span />;

export default {
    Component: DefaultView,
    ListComponent: DefaultView,
    AdminComponent: Empty,
    EditionComponent: DefaultEdition,
};
