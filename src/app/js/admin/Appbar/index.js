import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import StorageIcon from '@material-ui/icons/Storage';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import { makeStyles } from '@material-ui/core/styles';

import PublicationButton from '../publish/PublicationButton';
import { fromFields, fromUser } from '../../sharedSelectors';
import { fromParsing, fromPublication } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import colorsTheme from '../../../custom/colorsTheme';
import SidebarToggleButton from './SidebarToggleButton';
import Menu from './Menu';
import GoToPublicationButton from './GoToPublicationButton';
import JobProgress from './JobProgress';
import ValidationButton from '../publish/ValidationButton';
import { AppBar, Box, Button, CircularProgress, Toolbar } from '@mui/material';

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
    linksContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'stretch',
        height: 64,
    },
});

const styleButton = {
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
    '&.active': {
        borderBottom: `3px solid ${colorsTheme.white.primary}`,
        backgroundColor: colorsTheme.black.transparent,
    },
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
        <Box sx={{ display: 'flex', paddingLeft: '80px' }}>
            {isAdmin && (
                <>
                    <Button
                        component={NavLink}
                        to="/data"
                        variant="text"
                        startIcon={<StorageIcon />}
                        sx={styleButton}
                    >
                        <span>{polyglot.t('data')}</span>
                    </Button>
                    {hasLoadedDataset && (
                        <Button
                            component={NavLink}
                            to="/display"
                            variant="text"
                            startIcon={<AspectRatioIcon />}
                            sx={styleButton}
                        >
                            <span>{polyglot.t('display')}</span>
                        </Button>
                    )}
                </>
            )}
        </Box>
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
                    sx={classes.loading}
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
