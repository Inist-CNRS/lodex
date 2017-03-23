import React, { PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
    body: {
        backgroundColor: '#edecec',
    },
    linkToHome: {
        color: 'white',
        textDecoration: 'none',
    },
    loading: {
        margin: 8,
    },
};

export const AppComponent = ({ children }) => (
    <MuiThemeProvider>
        <div className="body" style={styles.body}>
            {children}
        </div>
    </MuiThemeProvider>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
