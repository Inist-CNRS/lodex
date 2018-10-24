import React from 'react';
import PropTypes from 'prop-types';

export const AppComponent = ({ children }) => (
    <div className="body">{children}</div>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
