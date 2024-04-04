import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import MenuList from '@mui/material/MenuList';
import Drawer from '@mui/material/Drawer';
import GridOnIcon from '@mui/icons-material/GridOn';
import PostAddIcon from '@mui/icons-material/PostAdd';
import MediationIcon from '@mui/icons-material/Mediation';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HomeIcon from '@mui/icons-material/Home';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ArticleIcon from '@mui/icons-material/Article';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromPublication } from '../selectors';
import { SidebarContext } from './SidebarContext';
import { useRouteMatch } from 'react-router-dom';
import {
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
    SCOPE_GRAPHIC,
} from '../../../../common/scope';
import { MenuItemLink } from './MenuItemLink';
import adminTheme from '../../../custom/themes/adminTheme';

const DRAWER_CLOSED_WIDTH = 50;
const DRAWER_OPEN_WIDTH = 205;
const ACTIVE_BORDER_WIDTH = 3;

const Sidebar = ({ p: polyglot, hasPublishedDataset }) => {
    const matchDisplayRoute = useRouteMatch('/display');
    const matchDataRoute = useRouteMatch('/data') || useRouteMatch('/config');

    const { open } = useContext(SidebarContext);

    if (!matchDisplayRoute && !matchDataRoute) {
        return null;
    }

    const menuItems = [
        matchDataRoute && (
            <MenuItemLink
                to="/data/existing"
                primaryText={polyglot.t('data')}
                leftIcon={<GridOnIcon />}
                key="data-existing"
            />
        ),
        matchDataRoute && (
            <MenuItemLink
                to="/data/enrichment"
                primaryText={polyglot.t('enrichment')}
                leftIcon={<PostAddIcon />}
                key="data-enrichment"
            />
        ),
        matchDataRoute && (
            <MenuItemLink
                to="/data/precomputed"
                primaryText={polyglot.t('precomputed')}
                leftIcon={<MediationIcon />}
                key="data-precomputed"
            />
        ),
        matchDataRoute && hasPublishedDataset && (
            <MenuItemLink
                to="/data/removed"
                primaryText={polyglot.t('hidden_resources')}
                leftIcon={<VisibilityOffIcon />}
                key="data-removed"
            />
        ),
        matchDisplayRoute && (
            <MenuItemLink
                to={`/display/${SCOPE_DATASET}`}
                primaryText={polyglot.t('home')}
                leftIcon={<HomeIcon />}
                key="display-home"
            />
        ),
        matchDisplayRoute && (
            <MenuItemLink
                to={`/display/${SCOPE_DOCUMENT}/main`}
                primaryText={polyglot.t('main_resource')}
                leftIcon={<ArticleIcon />}
                key="display-main-resource"
            />
        ),
        matchDisplayRoute && (
            <MenuItemLink
                to={`/display/${SCOPE_DOCUMENT}/subresource`}
                primaryText={polyglot.t('subresources')}
                leftIcon={<DocumentScannerIcon />}
                key="display-subresources"
            />
        ),
        matchDisplayRoute && (
            <MenuItemLink
                to={`/display/${SCOPE_GRAPHIC}`}
                primaryText={polyglot.t('graph_pages')}
                leftIcon={<EqualizerIcon />}
                key="display-graph-pages"
            />
        ),

        matchDisplayRoute && (
            <MenuItemLink
                to={`/display/search`}
                primaryText={polyglot.t('search_page')}
                leftIcon={<ManageSearchIcon />}
                key="display-search-page"
            />
        ),
    ].filter(Boolean);

    return (
        <>
            <Drawer
                variant="permanent"
                open={open}
                className="sidebar"
                sx={{
                    width: open ? DRAWER_OPEN_WIDTH : DRAWER_CLOSED_WIDTH,
                    zIndex: 0,
                    transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                    '& .MuiDrawer-paper': {
                        overflowX: 'hidden',
                        paddingTop: '64px',
                        backgroundColor:
                            adminTheme.palette.neutralDark.veryDark,
                        color: adminTheme.palette.contrast.main,
                        width: open ? DRAWER_OPEN_WIDTH : DRAWER_CLOSED_WIDTH,
                        transition:
                            'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                    },
                    '& .MuiMenuItem-root': {
                        fontSize: 'inherit',
                        borderLeft: `${ACTIVE_BORDER_WIDTH}px solid transparent`,
                        '&.active': {
                            borderLeft: `${ACTIVE_BORDER_WIDTH}px solid ${adminTheme.palette.primary.main}`,
                            backgroundColor:
                                adminTheme.palette.neutralDark.dark,
                        },
                        '&:hover': {
                            transition: 'background-color ease-in-out 400ms',
                            color: adminTheme.palette.contrast.main,
                            backgroundColor:
                                adminTheme.palette.neutralDark.light,
                        },
                        '& .MuiListItemIcon-root': {
                            minWidth: DRAWER_CLOSED_WIDTH - ACTIVE_BORDER_WIDTH,
                            justifyContent: 'center',
                            color: adminTheme.palette.contrast.main,
                        },
                    },
                }}
            >
                <MenuList>{menuItems}</MenuList>
            </Drawer>
        </>
    );
};

Sidebar.propTypes = {
    p: polyglotPropTypes.isRequired,
    hasPublishedDataset: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

export default compose(connect(mapStateToProps), translate)(Sidebar);
