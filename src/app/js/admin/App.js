import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import AppBar from './Appbar';
import getTitle from '../lib/getTitle';

export const AppComponent = ({ children }) => (
    <div>
        <Helmet>
            <title>{getTitle()}</title>
        </Helmet>
        <AppBar />

        <div className="body">{children}</div>
    </div>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
