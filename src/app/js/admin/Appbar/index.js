import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import StorageIcon from '@material-ui/icons/Storage';
import Fade from '@material-ui/core/Fade';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import {
    AppBar,
    CircularProgress,
    Button,
    Toolbar,
    LinearProgress,
    Box,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import PublicationButton from '../publish/PublicationButton';
import { fromUser } from '../../sharedSelectors';
import {
    fromParsing,
    fromProgress,
    fromPublication,
    fromPublish,
} from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Link from '../../lib/components/Link';
import theme from './../../theme';
import Menu from './Menu';
import GoToPublicationButton from './GoToPublicationButton';
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
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 4,
        marginRight: 4,
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
    loadingProgress: {
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
    },
    progress: {
        width: '100%',
        display: 'flex',
        margin: '0 4px 0',
    },
    colorPrimary: { backgroundColor: theme.white.primary },
    barColorPrimary: { backgroundColor: theme.green.secondary },
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
    borderBottom: `3px solid ${theme.white.primary}`,
    backgroundColor: theme.black.transparent,
};

const AppbarComponent = ({
    hasLoadedDataset,
    isLoading,
    isAdmin,
    p: polyglot,
    hasPublishedDataset,
    isPublishing,
    target,
    progress,
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
                    <Fade in={isPublishing} out={!isPublishing}>
                        <Box className={classes.progressContainer}>
                            <div className={classes.progressLabel}>
                                <CircularProgress
                                    variant="indeterminate"
                                    color={theme.white.primary}
                                    size={20}
                                />
                                <Typography>
                                    {polyglot.t('publishing')}
                                </Typography>
                            </div>
                            <LinearProgress
                                // className={classes.progress}
                                classes={{
                                    root: classes.progress,
                                    colorPrimary: classes.colorPrimary,
                                    barColorPrimary: classes.barColorPrimary,
                                }}
                                variant="determinate"
                                value={target ? (progress / target) * 100 : 0}
                            />
                        </Box>
                    </Fade>
                    {hasPublishedDataset && <GoToPublicationButton />}
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
    hasPublishedDataset: PropTypes.bool,
    isPublishing: PropTypes.bool,
    target: PropTypes.number,
    progress: PropTypes.number,
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
        isPublishing: fromPublish.getIsPublishing(state),
        ...fromProgress.getProgressAndTarget(state),
    })),
)(AppbarComponent);
