import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import MenuList from '@mui/material/MenuList';
import Drawer from '@mui/material/Drawer';
import GridOnIcon from '@mui/icons-material/GridOn';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import SourceIcon from '@mui/icons-material/Source';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ArticleIcon from '@mui/icons-material/Article';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { makeStyles } from '@material-ui/styles';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromPublication, fromParsing } from '../selectors';
import { SidebarContext } from './SidebarContext';
import colorsTheme from '../../../custom/colorsTheme';
import { useRouteMatch } from 'react-router-dom';
import {
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
    SCOPE_GRAPHIC,
} from '../../../../common/scope';
import ImportModelButton from '../ImportModelButton';
import { MenuItemLink } from './MenuItemLink';
import EnrichmentMenu from './EnrichmentMenu';
import SubresourceMenu from './SubresourceMenu';
import { SubMenu } from './SubMenu';

const DRAWER_CLOSED_WIDTH = 50;
const DRAWER_OPEN_WIDTH = 205;
const ACTIVE_BORDER_WIDTH = 3;

const useStyles = makeStyles({
    sidebarCallToAction: {
        color: colorsTheme.white.primary,
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 20,
        padding: '10px 10px',
        border: `3px dashed ${colorsTheme.white.transparent}`,
        borderRadius: 10,
        '&:hover': {
            transition: 'all ease-in-out 400ms',
            textDecoration: 'none',
            color: colorsTheme.white.primary,
            backgroundColor: colorsTheme.black.light,
        },
    },
    sidebarCallToActionDisabled: {
        color: colorsTheme.white.light,
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 20,
        padding: '10px 10px',
        border: `3px dashed ${colorsTheme.white.transparent}`,
        borderRadius: 10,
    },
});

const Sidebar = ({ p: polyglot, hasLoadedDataset, hasPublishedDataset }) => {
    const matchDisplayRoute = useRouteMatch('/display');
    const matchDataRoute = useRouteMatch('/data');
    const matchDocumentRoute = useRouteMatch(`/display/${SCOPE_DOCUMENT}`);
    const matchMainResourceRoute = useRouteMatch(
        `/display/${SCOPE_DOCUMENT}/main`,
    );
    const matchEnrichmentRoute = useRouteMatch('/data/enrichment');

    const [menuResourceOpen, setMenuResourceOpen] = useState(false);

    const { open } = useContext(SidebarContext);
    const classes = useStyles();

    if (!matchDisplayRoute && !matchDataRoute) {
        return null;
    }

    const menuItems = [
        matchDataRoute && (
            <MenuItemLink
                to="/data/existing"
                primaryText={polyglot.t('data')}
                leftIcon={<GridOnIcon />}
            />
        ),
        matchDataRoute && (
            <MenuItemLink
                to="/data/enrichment"
                primaryText={polyglot.t('enrichment')}
                leftIcon={<PostAddIcon />}
            />
        ),
        matchDataRoute && hasLoadedDataset && (
            <MenuItemLink
                to="/data/add"
                primaryText={polyglot.t('add_more')}
                leftIcon={<AddBoxIcon />}
            />
        ),
        matchDataRoute && hasPublishedDataset && (
            <MenuItemLink
                to="/data/removed"
                primaryText={polyglot.t('removed_resources')}
                leftIcon={<DeleteIcon />}
            />
        ),
        matchDisplayRoute && (
            <MenuItemLink
                to={`/display/${SCOPE_DATASET}`}
                primaryText={polyglot.t('home')}
                leftIcon={<HomeIcon />}
            />
        ),
        matchDisplayRoute && (
            <SubMenu
                handleToggle={() => setMenuResourceOpen(!menuResourceOpen)}
                isOpen={menuResourceOpen}
                name={polyglot.t('resource_pages')}
                icon={<SourceIcon />}
            >
                <MenuItemLink
                    to={`/display/${SCOPE_DOCUMENT}/main`}
                    primaryText={polyglot.t('main_resource')}
                    leftIcon={<ArticleIcon />}
                />
                <MenuItemLink
                    to={`/display/${SCOPE_DOCUMENT}/add`}
                    primaryText={polyglot.t('subresources')}
                    leftIcon={<DocumentScannerIcon />}
                />
            </SubMenu>
        ),
        matchDisplayRoute && (
            <MenuItemLink
                to={`/display/${SCOPE_GRAPHIC}`}
                primaryText={polyglot.t('graph_pages')}
                leftIcon={<EqualizerIcon />}
            />
        ),
        matchDisplayRoute && open && (
            <div
                title={
                    hasPublishedDataset && polyglot.t('import_model_published')
                }
            >
                <ImportModelButton
                    className={
                        !hasPublishedDataset
                            ? classes.sidebarCallToAction
                            : classes.sidebarCallToActionDisabled
                    }
                />
            </div>
        ),
    ].filter(Boolean);

    return (
        <>
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: open ? DRAWER_OPEN_WIDTH : DRAWER_CLOSED_WIDTH,
                    zIndex: 0,
                    overflowX: 'hidden',
                    transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                    '& .MuiDrawer-paper': {
                        paddingTop: '64px',
                        backgroundColor: colorsTheme.black.veryDark,
                        color: colorsTheme.white.primary,
                        width: open ? DRAWER_OPEN_WIDTH : DRAWER_CLOSED_WIDTH,
                        transition:
                            'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                    },
                    '& .MuiMenuItem-root': {
                        fontSize: 'inherit',
                        borderLeft: `${ACTIVE_BORDER_WIDTH}px solid transparent`,
                        '&.active': {
                            borderLeft: `${ACTIVE_BORDER_WIDTH}px solid ${colorsTheme.green.primary}`,
                        },
                        '&:hover': {
                            transition: 'background-color ease-in-out 400ms',
                            color: colorsTheme.white.primary,
                            backgroundColor: colorsTheme.black.light,
                        },
                        '& .MuiListItemIcon-root': {
                            minWidth: DRAWER_CLOSED_WIDTH - ACTIVE_BORDER_WIDTH,
                            justifyContent: 'center',
                            color: colorsTheme.white.primary,
                        },
                    },
                }}
            >
                <MenuList>{menuItems}</MenuList>
            </Drawer>
            {matchEnrichmentRoute && <EnrichmentMenu />}
            {matchDocumentRoute && !matchMainResourceRoute && (
                <SubresourceMenu />
            )}
        </>
    );
};

Sidebar.propTypes = {
    p: polyglotPropTypes.isRequired,
    hasPublishedDataset: PropTypes.bool.isRequired,
    hasLoadedDataset: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    hasLoadedDataset: fromParsing.hasUploadedFile(state),
});

export default compose(connect(mapStateToProps), translate)(Sidebar);
