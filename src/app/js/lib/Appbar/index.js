import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';

import { Link } from 'react-router';

import MenuSignedIn from './MenuSignedIn';
import MenuAnonymous from './MenuAnonymous';

const styles = {
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

    const RightElement = isLoggedIn
        ? <MenuSignedIn />
        : <MenuAnonymous />;

    return (
        <AppBar
            className="appbar"
            title={<Link style={styles.linkToHome} to="/home">Lodex</Link>}
            iconElementLeft={LeftElement}
            iconElementRight={RightElement}
        />
    );
};

AppbarComponent.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
};

export default AppbarComponent;
