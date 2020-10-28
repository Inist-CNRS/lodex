import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import StorageIcon from '@material-ui/icons/Storage';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';

import {
    AppBar,
    CircularProgress,
    Button,
    Toolbar,
    Menu,
    MenuItem,
} from '@material-ui/core';

import SignOutButton from './SignOutButton';
import PublicationButton from '../publish/PublicationButton';
import Settings from './Settings';
import { fromUser } from '../../sharedSelectors';
import { fromPublication, fromParsing } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Link from '../../lib/components/Link';

const styles = {
    linkToHome: {
        color: 'white',
        textDecoration: 'none',
        marginRight: '1rem',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        lineHeight: '54px',
        fontSize: 26,
    },
    buttons: {
        display: 'flex',
        paddingLeft: 100,
    },
    button: {
        color: 'white',
        minWidth: 100,
    },
    linksContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'center',
    },
};

const AppbarComponent = ({
    hasPublishedDataset,
    hasLoadedDataset,
    isLoading,
    isAdmin,
    p: polyglot,
}) => {
    console.log({
        hasPublishedDataset,
        hasLoadedDataset,
        isLoading,
        isAdmin,
        p: polyglot,
    });
    const leftElement = (
        <div style={styles.buttons}>
            {isAdmin && hasLoadedDataset && (
                <>
                    <Button
                        variant="text"
                        component={props => <Link to="/data" {...props} />}
                        style={styles.button}
                        startIcon={<StorageIcon />}
                    >
                        {polyglot.t('data')}
                    </Button>
                    <Button
                        variant="text"
                        component={props => <Link to="/display" {...props} />}
                        style={styles.button}
                        startIcon={<AspectRatioIcon />}
                    >
                        {polyglot.t('display')}
                    </Button>
                </>
            )}
        </div>
    );

    const rightElement = (
        <>
            {isAdmin && (
                <div style={{ display: 'flex' }}>
                    <Settings />
                    <SignOutButton />
                    {!hasPublishedDataset && <PublicationButton />}
                </div>
            )}
            {isLoading && (
                <CircularProgress
                    variant="indeterminate"
                    color="#fff"
                    size={30}
                    thickness={2}
                    style={styles.loading}
                />
            )}
        </>
    );

    return (
        <AppBar className="appbar">
            <Toolbar>
                <Link to="/" style={styles.linkToHome}>
                    Lodex
                </Link>
                <div style={styles.linksContainer}>
                    {leftElement}
                    {rightElement}
                </div>
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

export default compose(
    translate,
    connect(state => ({
        hasPublishedDataset: fromPublication.hasPublishedDataset(state),
        hasLoadedDataset: fromParsing.hasUploadedFile(state),
        isLoading: state.loading,
        isAdmin: fromUser.isAdmin(state),
    })),
)(AppbarComponent);
