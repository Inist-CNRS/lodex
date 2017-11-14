import React, { PropTypes } from 'react';
import AppBar from './Appbar';

export const AppComponent = ({ children }) => (
    <div>
        <AppBar />

        <div className="body">
            {children}
        </div>
    </div>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
