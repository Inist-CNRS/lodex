import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import NavBar from './NavBar';

export const AppComponent = ({ children }) => (
    <Fragment>
        <NavBar />
        <div className="body">{children}</div>
    </Fragment>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
