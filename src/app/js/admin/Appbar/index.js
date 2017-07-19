import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router';

import SignOutButton from './SignOutButton';
import SignInButton from './SignInButton';
import PublicationButton from '../publish/PublicationButton';
import ModelMenu from './ModelMenu';
import Settings from './Settings';
import UploadButton from '../upload/UploadButton';
import { fromUser } from '../../sharedSelectors';
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
        textDecoration: 'none',
        marginRight: '1rem',
    },
    button: {
        color: 'white',
    },
    loading: {
        margin: 8,
    },
    buttons: {
        display: 'flex',
    },
    title: {
        lineHeight: '54px',
    },
};

const AppbarComponent = ({ hasPublishedDataset, hasLoadedDataset, isLoading, isLoggedIn, p: polyglot }) => {
    const LeftElement = isLoading
        ? <CircularProgress color="#fff" size={30} thickness={2} style={styles.loading} />
        : <span />;

    const RightElement = (
        <div style={styles.buttons}>
            {isLoggedIn && !hasPublishedDataset && <UploadButton label={polyglot.t('upload_another_file')} />}
            {isLoggedIn && hasPublishedDataset &&
                <FlatButton
                    label={polyglot.t('moderation')}
                    containerElement={<Link to="/admin/contributions" />}
                    style={styles.button}
                />
            }
            {isLoggedIn && hasPublishedDataset &&
                <FlatButton
                    label={polyglot.t('removed_resources')}
                    containerElement={<Link to="/admin/removed" />}
                    style={styles.button}
                />
            }
            {isLoggedIn ? <ModelMenu canImport={!hasPublishedDataset} /> : <SignInButton />}
            {isLoggedIn && <Settings />}
            {isLoggedIn && <SignOutButton />}
            {isLoggedIn && !hasPublishedDataset && <PublicationButton /> }
        </div>
    );

    return (
        <AppBar
            className="appbar"
            title={
                <div style={styles.title}>
                    <Link to="/admin" style={styles.linkToHome}>Lodex</Link>
                    <small>
                        -{' '}
                        {
                            hasLoadedDataset
                            ? polyglot.t('modelize-your-data')
                            : polyglot.t('semantic-publication-system')
                        }
                    </small>
                </div>
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
    isLoading: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

AppbarComponent.defaultProps = {
    isLoading: false,
};

const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    hasLoadedDataset: fromParsing.hasUploadedFile(state),
    isLoading: state.loading, // @TODO fix by adding a loading reducer handling all loading state
    isLoggedIn: fromUser.isLoggedIn(state),
});

export default compose(
    translate,
    connect(mapStateToProps),
)(AppbarComponent);
