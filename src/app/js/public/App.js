import React, { PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
    appContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    bodyContainer: {
        display: 'flex',
        flex: '1',
        backgroundColor: '#edecec',
    },
    body: {
        flex: 1,
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
        <div style={styles.appContainer}>
            <div className="body" style={styles.bodyContainer}>
                <div style={styles.body}>{children}</div>
            </div>
        </div>
    </MuiThemeProvider>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
