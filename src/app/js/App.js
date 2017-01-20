import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';

import { isLoggedIn, toggleLogin } from './user/reducers';
import LoginDialog from './user/LoginDialog';

export const App = ({ children, isLoading, isLoggedIn, toggleLogin }) => {
    const LeftElement = isLoading
        ? <CircularProgress color="#fff" size={30} thickness={2} style={{ margin: 8 }} />
        : <span />;

    const RightElement = isLoggedIn
        ? <FlatButton containerElement={<Link to="/admin" />} linkButton={true} label="Admin" />
        : <FlatButton label="Sign in" onClick={toggleLogin} />;

    return (
        <MuiThemeProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppBar className="appbar" title="Lodex" iconElementLeft={LeftElement} iconElementRight={RightElement} />
                <div className="body" style={{ display: 'flex', flex: '1', backgroundColor: '#edecec' }}>
                    <div style={{ flex: 1 }}>{children}</div>
                </div>
                <LoginDialog />
            </div>
        </MuiThemeProvider>
    );
};

App.propTypes = {
    children: PropTypes.node,
    isLoading: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    toggleLogin: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    isLoading: state.loading,
    isLoggedIn: isLoggedIn(state),
});

const mapDispatchToProps = ({
    toggleLogin,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
