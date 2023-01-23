import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import StorageIcon from '@material-ui/icons/Storage';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import { AppBar, CircularProgress, Button, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import PublicationButton from '../publish/PublicationButton';
import { fromFields, fromUser } from '../../sharedSelectors';
import { fromParsing, fromPublication } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Link from '../../lib/components/Link';
import colorsTheme from '../../../custom/colorsTheme';
import SidebarToggleButton from './SidebarToggleButton';
import Menu from './Menu';
import GoToPublicationButton from './GoToPublicationButton';
import JobProgress from './JobProgress';
import ValidationButton from '../publish/ValidationButton';
const useStyles = makeStyles({
    linkToHome: {
        color: `${colorsTheme.white.primary} !important`,
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
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 4,
        marginRight: 4,
    },
    button: {
        color: colorsTheme.white.primary,
        borderRadius: 0,
        padding: '0 20px',
        boxSizing: 'border-box',
        borderBottom: `3px solid ${colorsTheme.green.primary}`,
        '&:hover': {
            transition: 'all ease-in-out 400ms',
            borderBottom: `3px solid ${colorsTheme.white.primary}`,
            color: colorsTheme.white.primary,
        },
    },
    linksContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'stretch',
        height: 64,
    },
    loadingProgress: {
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
    },
    progress: {
        width: '100%',
        display: 'flex',
        margin: '0 4px 0',
    },
    colorPrimary: { backgroundColor: colorsTheme.white.primary },
    barColorPrimary: { backgroundColor: colorsTheme.green.secondary },
    progressContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginLeft: 'auto',
        width: '130px',
    },
    progressLabel: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});

const activeButtonStyle = {
    borderBottom: `3px solid ${colorsTheme.white.primary}`,
    backgroundColor: colorsTheme.black.transparent,
};

const AppbarComponent = ({
    hasLoadedDataset,
    isLoading,
    isAdmin,
    p: polyglot,
    hasPublishedDataset,
    invalidFields,
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
                    <JobProgress />
                    {hasPublishedDataset && <GoToPublicationButton />}
                    {invalidFields.length > 0 && <ValidationButton />}
                    <PublicationButton className={classes.button} />
                    <Menu />
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
            <Toolbar disableGutters>
                {isAdmin && <SidebarToggleButton />}
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
    hasPublishedDataset: PropTypes.bool,
    invalidFields: PropTypes.arrayOf(PropTypes.object),
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
        hasPublishedDataset: fromPublication.hasPublishedDataset(state),
        invalidFields: fromFields.getInvalidFields(state),
    })),
)(AppbarComponent);
