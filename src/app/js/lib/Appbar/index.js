import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';

import AdminButton from './AdminButton';
import SignInButton from './SignInButton';
import ExportMenu from './ExportMenu';

const styles = {
    appBar: {
        zIndex: 1,
    },
    linkToHome: {
        color: 'white',
        textDecoration: 'none',
    },
    loading: {
        margin: 8,
    },
};

const AppbarComponent = ({ isLoading, isLoggedIn }) => {
    const LeftElement = isLoading
        ? <CircularProgress color="#fff" size={30} thickness={2} style={styles.loading} />
        : <span />;

    const RightElement = (
        <div>
            { isLoggedIn ? <AdminButton /> : <SignInButton /> }
            <ExportMenu />
        </div>
    );

    return (
        <AppBar
            className="appbar"
            title={<a style={styles.linkToHome} href="/">Lodex</a>}
            iconElementLeft={LeftElement}
            iconElementRight={RightElement}
            style={styles.appBar}
        />
    );
};

AppbarComponent.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
};

export default AppbarComponent;
