import React from 'react';
import PropTypes from 'prop-types';
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

const AppbarComponent = ({
    hasPublishedDataset,
    hasLoadedDataset,
    isLoading,
    isAdmin,
    p: polyglot,
}) => {
    const LeftElement = isLoading ? (
        <CircularProgress
            color="#fff"
            size={30}
            thickness={2}
            style={styles.loading}
        />
    ) : (
        <span />
    );

    const RightElement = (
        <div style={styles.buttons}>
            {isAdmin && (
                <UploadButton
                    label={polyglot.t(
                        hasPublishedDataset
                            ? 'upload_additional_file'
                            : 'upload_another_file',
                    )}
                />
            )}
            {isAdmin &&
                hasPublishedDataset && (
                    <FlatButton
                        label={polyglot.t('moderation')}
                        containerElement={<Link to="/contributions" />}
                        style={styles.button}
                    />
                )}
            {isAdmin &&
                hasPublishedDataset && (
                    <FlatButton
                        label={polyglot.t('removed_resources')}
                        containerElement={<Link to="/removed" />}
                        style={styles.button}
                    />
                )}
            {isAdmin ? (
                <ModelMenu hasPublishedDataset={hasPublishedDataset} />
            ) : (
                <SignInButton />
            )}
            {isAdmin && <Settings />}
            {isAdmin && <SignOutButton />}
            {isAdmin && !hasPublishedDataset && <PublicationButton />}
        </div>
    );

    return (
        <AppBar
            className="appbar"
            title={
                <div style={styles.title}>
                    <Link to="/" style={styles.linkToHome}>
                        Lodex
                    </Link>
                    <small>
                        -{' '}
                        {hasLoadedDataset
                            ? polyglot.t('modelize-your-data')
                            : polyglot.t('semantic-publication-system')}
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
    isAdmin: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

AppbarComponent.defaultProps = {
    isLoading: false,
};

const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    hasLoadedDataset: fromParsing.hasUploadedFile(state),
    isLoading: state.loading, // @TODO fix by adding a loading reducer handling all loading state
    isAdmin: fromUser.isAdmin(state),
});

export default compose(translate, connect(mapStateToProps))(AppbarComponent);
