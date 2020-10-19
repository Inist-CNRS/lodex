import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { AppBar, CircularProgress, Button, Toolbar } from '@material-ui/core';

import SignOutButton from './SignOutButton';
import SignInButton from './SignInButton';
import PublicationButton from '../publish/PublicationButton';
import ModelMenu from './ModelMenu';
import Settings from './Settings';
import UploadButton from '../upload/UploadButton';
import { fromUser } from '../../sharedSelectors';
import { fromPublication, fromParsing } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Link from '../../lib/components/Link';

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
            variant="indeterminate"
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
            {isAdmin && hasPublishedDataset && (
                <Button
                    variant="text"
                    component={props => <Link to="/removed" {...props} />}
                    style={styles.button}
                >
                    {polyglot.t('removed_resources')}
                </Button>
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
            style={styles.appBar}
        >
            <Toolbar>
                {LeftElement}
                {RightElement}
            </Toolbar>
        </AppBar>
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
