import React, { PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from './Appbar';

export const AppComponent = ({ children }) => (
    <MuiThemeProvider>
        <div>
            <AppBar />

            <div className="body">
                {children}
            </div>
        </div>
    </MuiThemeProvider>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
