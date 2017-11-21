import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import getTitle from '../lib/getTitle';

export const AppComponent = ({ children }) => (
    <div className="body">
        <Helmet>
            <title>{getTitle()}</title>
        </Helmet>
        {children}
    </div>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
