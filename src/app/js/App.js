import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from './lib/Appbar';

import { isLoggedIn as getIsLoggedIn } from './user';
import LoginDialog from './user/LoginDialog';

const styles = {
    appContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
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

export const AppComponent = ({ children, isLoading, isLoggedIn }) => (
    <MuiThemeProvider>
        <div style={styles.appContainer}>
            <AppBar isLoading={isLoading} isLoggedIn={isLoggedIn} />

            <div className="body" style={styles.bodyContainer}>
                <div style={styles.body}>{children}</div>
            </div>
            <LoginDialog />
        </div>
    </MuiThemeProvider>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
    isLoading: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
};

AppComponent.defaultProps = {
    isLoading: false,
};

const mapStateToProps = state => ({
    isLoading: state.loading,
    isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps)(AppComponent);
