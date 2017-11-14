import React, { PropTypes } from 'react';

export const AppComponent = ({ children }) => (
    <div className="body">
        {children}
    </div>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
