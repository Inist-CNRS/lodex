import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import StorageIcon from '@mui/icons-material/Storage';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import { Link, NavLink } from 'react-router-dom';

import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Link as MuiLink,
    Toolbar,
} from '@mui/material';
import { useTranslate } from '../../i18n/I18NContext';
import { fromFields, fromUser } from '../../sharedSelectors';
import PublicationButton from '../publish/PublicationButton';
import ValidationButton from '../publish/ValidationButton';
import { fromPublication } from '../selectors';
import GoToPublicationButton from './GoToPublicationButton';
import JobProgress from './JobProgress';
import Menu from './Menu';
import SidebarToggleButton from './SidebarToggleButton';

const styles = {
    linksContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'stretch',
        height: 64,
    },
    linkToHome: {
        color: `var(--contrast-main) !important`,
        textDecoration: 'none',
        marginRight: '1rem',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        lineHeight: '54px',
        fontSize: 26,
    },
    button: {
        color: 'var(--contrast-main)',
        borderRadius: 0,
        padding: '0 20px',
        boxSizing: 'border-box',
        borderBottom: `3px solid var(--primary-main)`,
        '&:hover': {
            transition: 'all ease-in-out 400ms',
            borderBottom: `3px solid var(--contrast-main)`,
            color: 'var(--contrast-main)',
        },
        '&.active': {
            borderBottom: `3px solid var(--contrast-main)`,
            backgroundColor: 'var(--neutral-dark-transparent)',
        },
    },
};

const AppbarComponent = ({
    // @ts-expect-error TS7031
    isLoading,
    // @ts-expect-error TS7031
    isAdmin,
    // @ts-expect-error TS7031
    hasPublishedDataset,
    // @ts-expect-error TS7031
    invalidFields,
}) => {
    const { translate } = useTranslate();
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
                        <span>{translate('data')}</span>
                    </Button>
                    <Button
                        component={NavLink}
                        to="/display"
                        variant="text"
                        startIcon={<AspectRatioIcon />}
                        sx={styles.button}
                    >
                        <span>{translate('display')}</span>
                    </Button>
                    <Button
                        component={NavLink}
                        to="/annotations"
                        variant="text"
                        startIcon={<MapsUgcIcon />}
                        sx={styles.button}
                    >
                        <span>{translate('annotations')}</span>
                    </Button>
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
                    // @ts-expect-error TS2322
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
                <MuiLink
                    component={Link}
                    to="/"
                    sx={{
                        ...styles.linkToHome,
                        marginLeft: !isAdmin ? 2 : 0,
                    }}
                >
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
    isLoading: PropTypes.bool,
    isAdmin: PropTypes.bool.isRequired,
    hasPublishedDataset: PropTypes.bool,
    invalidFields: PropTypes.arrayOf(PropTypes.object),
};

AppbarComponent.defaultProps = {
    isLoading: false,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    isLoading: state.loading,
    // @ts-expect-error TS2339
    isAdmin: fromUser.isAdmin(state),
    // @ts-expect-error TS2339
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    // @ts-expect-error TS2339
    invalidFields: fromFields.getInvalidFields(state),
});

export default connect(mapStateToProps)(AppbarComponent);
