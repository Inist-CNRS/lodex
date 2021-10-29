import React, { Fragment } from 'react';
import { Box } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import DescriptionIcon from '@material-ui/icons/Description';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import GridOnIcon from '@material-ui/icons/GridOn';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import PlusIcon from '@material-ui/icons/Add';
import PostAddIcon from '@material-ui/icons/PostAdd';
import MainResourceIcon from '@material-ui/icons/InsertDriveFile';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';

import { polyglot as polyglotPropTypes } from '../propTypes';
import PrivateRoute from './PrivateRoute';
import ImportModelButton from './ImportModelButton.js';
import { fromPublication, fromParsing } from './selectors';
import theme from './../theme';
import {
    SCOPE_DOCUMENT,
    SCOPE_DATASET,
    SCOPE_GRAPHIC,
} from '../../../common/scope';

const useStyles = makeStyles({
    sidebar: {
        paddingTop: 64,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: theme.black.veryDark,
        textAlign: 'center',
        position: 'sticky',
        top: 0,
        height: '100vh',
    },
    sidebarNavLink: {
        color: theme.white.primary,
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: 20,
        '&:hover': {
            transition: 'all ease-in-out 400ms',
            textDecoration: 'none',
            color: theme.white.primary,
            backgroundColor: theme.black.light,
        },
    },
    sidebarCallToAction: {
        color: theme.white.primary,
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 20,
        padding: '10px 10px',
        border: `3px dashed ${theme.white.transparent}`,
        borderRadius: 10,
        '&:hover': {
            transition: 'all ease-in-out 400ms',
            textDecoration: 'none',
            color: theme.white.primary,
            backgroundColor: theme.black.light,
        },
    },
    sidebarDeleteNavLink: {
        marginTop: 'auto',
    },
    subSidebar: {
        width: 200,
        paddingTop: 64,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: theme.black.dark,
        position: 'sticky',
        top: 0,
        height: '100vh',
    },
    iconLinkContainer: {
        width: 125,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        textDecoration: 'none',
    },
    iconSubLinkContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        textDecoration: 'none',
    },
    separator: {
        width: '90%',
        border: 'none',
        borderTop: `1px solid ${theme.white.transparent}`,
    },
});

const sidebarNavLinkActiveStyle = {
    color: theme.white.primary,
    backgroundColor: theme.black.dark,
};

const subSidebarNavLinkActiveStyle = {
    color: theme.white.primary,
    backgroundColor: theme.white.transparent,
};

const DocumentMenu = compose(
    connect(s => ({ subresource: s.subresource })),
    translate,
)(({ p: polyglot, subresource }) => {
    const classes = useStyles();
    return (
        <div className={classnames(classes.subSidebar, 'sub-sidebar')}>
            <Box className={classes.iconSubLinkContainer}>
                <NavLink
                    className={classes.sidebarNavLink}
                    activeStyle={subSidebarNavLinkActiveStyle}
                    to="/display/document/main"
                >
                    <MainResourceIcon />
                    {polyglot.t('main_resource')}
                </NavLink>
            </Box>
            {(subresource.subresources || []).map(r => (
                <Fragment key={r._id}>
                    <hr className={classes.separator} />
                    <Box className={classes.iconSubLinkContainer}>
                        <NavLink
                            className={classes.sidebarNavLink}
                            activeStyle={subSidebarNavLinkActiveStyle}
                            to={`/display/document/${r._id}`}
                        >
                            {r.name}
                        </NavLink>
                    </Box>
                </Fragment>
            ))}
            <Box className={classes.iconSubLinkContainer}>
                <NavLink
                    className={classes.sidebarCallToAction}
                    activeStyle={subSidebarNavLinkActiveStyle}
                    to="/display/document/add"
                >
                    <PlusIcon />
                    {polyglot.t('new_subresource')}
                </NavLink>
            </Box>
        </div>
    );
});

const EnrichmentMenu = compose(
    connect(s => ({ enrichment: s.enrichment })),
    translate,
)(({ p: polyglot, enrichment }) => {
    const classes = useStyles();
    return (
        <div className={classnames(classes.subSidebar, 'sub-sidebar')}>
            {(enrichment.enrichments || []).map(e => (
                <Fragment key={e._id}>
                    <hr className={classes.separator} />
                    <Box className={classes.iconSubLinkContainer}>
                        <NavLink
                            className={classes.sidebarNavLink}
                            activeStyle={subSidebarNavLinkActiveStyle}
                            to={`/data/enrichment/${e._id}`}
                        >
                            {e.name}
                        </NavLink>
                    </Box>
                </Fragment>
            ))}
            <Box className={classes.iconSubLinkContainer}>
                <NavLink
                    className={classes.sidebarCallToAction}
                    activeStyle={subSidebarNavLinkActiveStyle}
                    to="/data/enrichment/add"
                >
                    <PlusIcon />
                    {polyglot.t('new_enrichment')}
                </NavLink>
            </Box>
        </div>
    );
});

const InnerSidebarComponent = ({
    hasPublishedDataset,
    hasLoadedDataset,
    p: polyglot,
}) => {
    const classes = useStyles();
    return (
        <>
            <Route path="/display">
                <div className={classnames(classes.sidebar, 'sidebar')}>
                    <Box className={classes.iconLinkContainer}>
                        <NavLink
                            className={classes.sidebarNavLink}
                            activeStyle={sidebarNavLinkActiveStyle}
                            to={`/display/${SCOPE_DATASET}`}
                        >
                            <HomeIcon />
                            {polyglot.t('home')}
                        </NavLink>
                    </Box>
                    <Box className={classes.iconLinkContainer}>
                        <NavLink
                            className={classes.sidebarNavLink}
                            activeStyle={sidebarNavLinkActiveStyle}
                            to={`/display/${SCOPE_DOCUMENT}`}
                        >
                            <DescriptionIcon />
                            {polyglot.t('resource_pages')}
                        </NavLink>
                    </Box>
                    <Box className={classes.iconLinkContainer}>
                        <NavLink
                            className={classes.sidebarNavLink}
                            activeStyle={sidebarNavLinkActiveStyle}
                            to={`/display/${SCOPE_GRAPHIC}`}
                        >
                            <EqualizerIcon />
                            {polyglot.t('graph_pages')}
                        </NavLink>
                    </Box>
                    <Box className={classes.iconLinkContainer}>
                        <ImportModelButton
                            className={classes.sidebarCallToAction}
                        />
                    </Box>
                </div>
                <Route path={`/display/${SCOPE_DOCUMENT}`}>
                    <DocumentMenu />
                </Route>
            </Route>
            <Route path="/data">
                <div className={classnames(classes.sidebar, 'sidebar')}>
                    <Box className={classes.iconLinkContainer}>
                        <NavLink
                            className={classes.sidebarNavLink}
                            activeStyle={sidebarNavLinkActiveStyle}
                            to="/data/existing"
                        >
                            <GridOnIcon />
                            {polyglot.t('data')}
                        </NavLink>
                    </Box>
                    <Box className={classes.iconLinkContainer}>
                        <NavLink
                            className={classes.sidebarNavLink}
                            activeStyle={sidebarNavLinkActiveStyle}
                            to="/data/enrichment"
                        >
                            <PostAddIcon />
                            {polyglot.t('enrichment')}
                        </NavLink>
                    </Box>
                    {hasLoadedDataset && (
                        <Box className={classes.iconLinkContainer}>
                            <NavLink
                                className={classes.sidebarNavLink}
                                activeStyle={sidebarNavLinkActiveStyle}
                                to="/data/add"
                            >
                                <AddBoxIcon />
                                {polyglot.t('add_more')}
                            </NavLink>
                        </Box>
                    )}
                    {hasPublishedDataset && (
                        <Box className={classes.iconLinkContainer}>
                            <NavLink
                                className={classnames(
                                    classes.sidebarDeleteNavLink,
                                    classes.sidebarNavLink,
                                )}
                                activeStyle={sidebarNavLinkActiveStyle}
                                to="/data/removed"
                            >
                                <DeleteIcon />
                                {polyglot.t('removed_resources')}
                            </NavLink>
                        </Box>
                    )}
                </div>
                <Route path={`/data/enrichment`}>
                    <EnrichmentMenu />
                </Route>
            </Route>
        </>
    );
};

InnerSidebarComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    hasPublishedDataset: PropTypes.bool.isRequired,
    hasLoadedDataset: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    hasLoadedDataset: fromParsing.hasUploadedFile(state),
});

const ConnectedSidebar = compose(
    connect(mapStateToProps),
    translate,
)(InnerSidebarComponent);

export const Sidebar = () => (
    <PrivateRoute path={['/display', '/data']} component={ConnectedSidebar} />
);
