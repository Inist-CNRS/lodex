import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';

import SignOutButton from './SignOutButton';
import SignInButton from './SignInButton';
import PublicationButton from '../publish/PublicationButton';
import ModelMenu from './ModelMenu';
import UploadButton from '../upload/UploadButton';
import { isLoggedIn as getIsLoggedIn } from '../../user';
import { fromPublication, fromParsing } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    appBar: {
        zIndex: 1,
        height: 54,
        lineHeight: 'normal',
    },
    linkToHome: {
        color: 'white',
        fontSize: 'medium',
        textDecoration: 'none',
    },
    loading: {
        margin: 8,
    },
    buttons: {
        display: 'flex',
    },
};

const AppbarComponent = ({ hasPublishedDataset, hasLoadedDataset, isLoading, isLoggedIn, p: polyglot }) => {
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
            title={
                <span>
                    <a style={styles.linkToHome} href="/">Lodex</a>
                    {!hasPublishedDataset && <span> {hasLoadedDataset ?
                        polyglot.t('modelize-your-data')
                        :
                        polyglot.t('semantic-publication-system')
                    }</span>}
                </span>
            }
            iconElementLeft={LeftElement}
            iconElementRight={RightElement}
            style={styles.appBar}
        />
    );
};

AppbarComponent.propTypes = {
    hasPublishedDataset: PropTypes.bool.isRequired,
    hasLoadedDataset: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    hasLoadedDataset: fromParsing.hasUploadedFile(state),
    isLoading: state.loading, // @TODO fix by adding a loading reducer handling all loading state
    isLoggedIn: getIsLoggedIn(state),
});

export default compose(
    translate,
    connect(mapStateToProps),
)(AppbarComponent);
