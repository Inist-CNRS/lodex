import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';

import { isSignedIn, toggleSignIn } from './signIn/reducers';
import SignInDialog from './signIn/SignInDialog';

export const App = ({ children, isLoading, isSignedIn, toggleSignIn }) => {
    const LeftElement = isLoading
        ? <CircularProgress color="#fff" size={30} thickness={2} style={{ margin: 8 }} />
        : <span />;

    const RightElement = isSignedIn
        ? null
        : <FlatButton label="Sign in" onClick={toggleSignIn} />;

    return (
        <MuiThemeProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppBar className="appbar" title="Lodex" iconElementLeft={LeftElement} iconElementRight={RightElement} />
                <div className="body" style={{ display: 'flex', flex: '1', backgroundColor: '#edecec' }}>
                    <div style={{ flex: 1 }}>{children}</div>
                </div>
                <SignInDialog />
            </div>
        </MuiThemeProvider>
    );
};

App.propTypes = {
    children: PropTypes.node,
    isLoading: PropTypes.bool,
    isSignedIn: PropTypes.bool.isRequired,
    toggleSignIn: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    isLoading: state.loading,
    isSignedIn: isSignedIn(state),
});

const mapDispatchToProps = ({
    toggleSignIn,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
