import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import StorageIcon from '@mui/icons-material/Storage';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';

import PublicationButton from '../publish/PublicationButton';
import { fromFields, fromUser } from '../../sharedSelectors';
import { fromParsing, fromPublication } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import SidebarToggleButton from './SidebarToggleButton';
import Menu from './Menu';
import GoToPublicationButton from './GoToPublicationButton';
import JobProgress from './JobProgress';
import ValidationButton from '../publish/ValidationButton';
import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Toolbar,
    Link as MuiLink,
} from '@mui/material';
import adminTheme from '../../../custom/adminTheme';

const styles = {
    linksContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'stretch',
        height: 64,
    },
    linkToHome: {
        color: `${adminTheme.palette.contrast.main} !important`,
        textDecoration: 'none',
        marginRight: '1rem',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        lineHeight: '54px',
        fontSize: 26,
    },
    button: {
        color: adminTheme.palette.contrast.main,
        borderRadius: 0,
        padding: '0 20px',
        boxSizing: 'border-box',
        borderBottom: `3px solid ${adminTheme.palette.primary.main}`,
        '&:hover': {
            transition: 'all ease-in-out 400ms',
            borderBottom: `3px solid ${adminTheme.palette.contrast.main}`,
            color: adminTheme.palette.contrast.main,
        },
        '&.active': {
            borderBottom: `3px solid ${adminTheme.palette.contrast.main}`,
            backgroundColor: adminTheme.palette.neutralDark.transparent,
        },
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
    const leftElement = (
        <Box sx={{ display: 'flex', paddingLeft: '80px' }}>
            {isAdmin && (
                <>
                    <Button
                        component={NavLink}
                        to="/data"
                        variant="text"
                        startIcon={<StorageIcon />}
                        sx={styles.button}
                    >
                        <span>{polyglot.t('data')}</span>
                    </Button>
                    {hasLoadedDataset && (
                        <Button
                            component={NavLink}
                            to="/display"
                            variant="text"
                            startIcon={<AspectRatioIcon />}
                            sx={styles.button}
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
                    <PublicationButton />
                    <Menu />
                </div>
            )}
            {isLoading && (
                <CircularProgress
                    variant="indeterminate"
                    color="#fff"
                    size={30}
                    thickness={2}
                />
            )}
        </>
    );

    return (
        <AppBar className="appbar">
            <Toolbar disableGutters>
                {isAdmin && <SidebarToggleButton />}
                <MuiLink component={Link} to="/" sx={styles.linkToHome}>
                    Lodex
                </MuiLink>
                <Box sx={styles.linksContainer}>
                    {leftElement}
                    {rightElement}
                </Box>
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
