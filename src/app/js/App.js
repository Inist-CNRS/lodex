import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';

import { isLoggedIn as isLoggedInAction, toggleLogin as toggleLoginAction } from './user';
import LoginDialog from './user/LoginDialog';

export const AppComponent = ({ children, isLoading, isLoggedIn, toggleLogin }) => {
    const LeftElement = isLoading
        ? <CircularProgress color="#fff" size={30} thickness={2} style={{ margin: 8 }} />
        : <span />;

    const RightElement = isLoggedIn
        ? <FlatButton containerElement={<Link to="/admin" />} linkButton label="Admin" />
        : <FlatButton label="Sign in" onClick={toggleLogin} />;

    return (
        <MuiThemeProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppBar
                    className="appbar"
                    title="Lodex"
                    iconElementLeft={LeftElement}
                    iconElementRight={RightElement}
                />
                <div className="body" style={{ display: 'flex', flex: '1', backgroundColor: '#edecec' }}>
                    <div style={{ flex: 1 }}>{children}</div>
                </div>
                <LoginDialog />
            </div>
        </MuiThemeProvider>
    );
};

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
    isLoading: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    toggleLogin: PropTypes.func.isRequired,
};

AppComponent.defaultProps = {
    isLoading: false,
};

const mapStateToProps = state => ({
    isLoading: state.loading,
    isLoggedIn: isLoggedInAction(state),
});

const mapDispatchToProps = ({
    toggleLogin: toggleLoginAction,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppComponent);
