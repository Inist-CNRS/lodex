import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import StorageIcon from '@mui/icons-material/Storage';

import { connect } from 'react-redux';
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
import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';
import { fromFields, fromUser } from '../../../../src/app/js/sharedSelectors';
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

interface AppbarComponentProps {
    isLoading?: boolean;
    isAdmin: boolean;
    hasPublishedDataset?: boolean;
    invalidFields?: object[];
}

const AppbarComponent = ({
    isLoading = false,
    isAdmin,
    hasPublishedDataset,
    invalidFields,
}: AppbarComponentProps) => {
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
                    {/*
                     // @ts-expect-error TS18048 */}
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    isLoading: state.loading,
    isAdmin: fromUser.isAdmin(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    invalidFields: fromFields.getInvalidFields(state),
});

export default connect(mapStateToProps)(AppbarComponent);
