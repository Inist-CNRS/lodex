import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';

import SignOutButton from './SignOutButton';
import SignInButton from './SignInButton';
import PublicationButton from '../publish/PublicationButton';
import ModelMenu from './ModelMenu';
import UploadButton from '../upload/UploadButton';
import { isLoggedIn as getIsLoggedIn } from '../../user';
import { fromPublication } from '../selectors';

const styles = {
    appBar: {
        zIndex: 1,
        height: 54,
        lineHeight: 'normal',
    },
    linkToHome: {
        color: 'white',
        textDecoration: 'none',
    },
    loading: {
        margin: 8,
    },
    buttons: {
        display: 'flex',
    },
};

const AppbarComponent = ({ hasPublishedDataset, isLoading, isLoggedIn }) => {
    const LeftElement = isLoading
        ? <CircularProgress color="#fff" size={30} thickness={2} style={styles.loading} />
        : <span />;

    const RightElement = (
        <div style={styles.buttons}>
            {isLoggedIn && !hasPublishedDataset && <UploadButton />}
            {isLoggedIn ? <ModelMenu canImport={!hasPublishedDataset} /> : <SignInButton />}
            {isLoggedIn && <SignOutButton />}
            {isLoggedIn && !hasPublishedDataset && <PublicationButton /> }
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
    hasPublishedDataset: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    isLoading: state.loading, // @TODO fix by adding a loading reducer handling all loading state
    isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps)(AppbarComponent);

