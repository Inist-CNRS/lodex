import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import StorageIcon from '@material-ui/icons/Storage';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import SettingsIcon from '@material-ui/icons/Settings';
import { AppBar, CircularProgress, Button, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SignOutButton from './SignOutButton';
import PublicationButton from '../publish/PublicationButton';
import { fromUser } from '../../sharedSelectors';
import { fromParsing } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Link from '../../lib/components/Link';
import theme from './../../theme';

const useStyles = makeStyles({
    linkToHome: {
        color: `${theme.white.primary} !important`,
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
        color: theme.white.primary,
        borderRadius: 0,
        padding: '0 20px',
        boxSizing: 'border-box',
        borderBottom: `3px solid ${theme.green.primary}`,
        '&:hover': {
            transition: 'all ease-in-out 400ms',
            borderBottom: `3px solid ${theme.white.primary}`,
            color: theme.white.primary,
        },
    },
    linksContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'stretch',
        height: 64,
    },
});

const activeButtonStyle = {
    borderBottom: `3px solid ${theme.white.primary}`,
    backgroundColor: theme.black.transparent,
};

const AppbarComponent = ({
    hasLoadedDataset,
    isLoading,
    isAdmin,
    p: polyglot,
}) => {
    const classes = useStyles();
    const leftElement = (
        <div className={classes.buttons}>
            {isAdmin && (
                <>
                    <NavLink
                        to="/data"
                        component={Button}
                        variant="text"
                        className={classes.button}
                        startIcon={<StorageIcon />}
                        activeStyle={activeButtonStyle}
                    >
                        <span>{polyglot.t('data')}</span>
                    </NavLink>
                    {hasLoadedDataset && (
                        <NavLink
                            to="/display"
                            component={Button}
                            variant="text"
                            className={classes.button}
                            startIcon={<AspectRatioIcon />}
                            activeStyle={activeButtonStyle}
                        >
                            <span>{polyglot.t('display')}</span>
                        </NavLink>
                    )}
                </>
            )}
        </div>
    );

    const rightElement = (
        <>
            {isAdmin && (
                <div style={{ display: 'flex' }}>
                    <NavLink
                        to="/settings"
                        component={Button}
                        variant="text"
                        className={classes.button}
                        startIcon={<SettingsIcon />}
                        activeStyle={activeButtonStyle}
                    >
                        <span>{polyglot.t('settings')}</span>
                    </NavLink>
                    <SignOutButton className={classes.button} />
                    <PublicationButton className={classes.button} />
                </div>
            )}
            {isLoading && (
                <CircularProgress
                    variant="indeterminate"
                    color="#fff"
                    size={30}
                    thickness={2}
                    className={classes.loading}
                />
            )}
        </>
    );

    return (
        <AppBar className="appbar">
            <Toolbar>
                <Link to="/" className={classes.linkToHome}>
                    Lodex
                </Link>
                <div className={classes.linksContainer}>
                    {leftElement}
                    {rightElement}
                </div>
            </Toolbar>
        </AppBar>
    );
};

AppbarComponent.propTypes = {
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
        hasLoadedDataset: fromParsing.hasUploadedFile(state),
        isLoading: state.loading,
        isAdmin: fromUser.isAdmin(state),
    })),
)(AppbarComponent);
