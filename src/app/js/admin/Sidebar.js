import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import DescriptionIcon from '@material-ui/icons/Description';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import GridOnIcon from '@material-ui/icons/GridOn';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';

import { polyglot as polyglotPropTypes } from '../propTypes';
import PrivateRoute from './PrivateRoute';
import { fromPublication, fromParsing } from './selectors';

const styles = {
    sidebar: {
        width: 160,
        paddingTop: 100,
        marginLeft: -10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#333',
        textAlign: 'center',
    },
    sidebarNavLink: {
        color: '#fff',
        textDecoration: 'none',
    },
    sidebarNavLinkActive: {
        color: '#7DBD42',
    },
    subSidebar: {
        width: 240,
        paddingTop: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#555',
    },
    subSidebarNavLink: {
        textDecoration: 'none',
        color: '#888',
        fontSize: 18,
        padding: 36,
        minHeight: 54,
        textAlign: 'center',
        display: 'block',
    },
    iconLinkContainer: {
        width: 125,
        height: 125,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        padding: 20,
        textDecoration: 'none',
    },
};

const DocumentMenu = compose(
    connect(s => ({ subresource: s.subresource })),
    translate,
)(({ p: polyglot, subresource }) => (
    <div style={styles.subSidebar} className="sub-sidebar">
        <div>
            <NavLink
                style={styles.subSidebarNavLink}
                activeStyle={{ color: 'white' }}
                to="/display/document/main"
            >
                {polyglot.t('main_resource')}
            </NavLink>
        </div>
        {(subresource.subresources || []).map(r => (
            <div key={r._id}>
                <NavLink
                    style={styles.subSidebarNavLink}
                    activeStyle={{ color: 'white' }}
                    to={`/display/document/${r._id}`}
                >
                    {r.name}
                </NavLink>
            </div>
        ))}
        <div>
            <NavLink
                style={styles.subSidebarNavLink}
                activeStyle={{ color: 'white' }}
                to="/display/document/add"
            >
                + {polyglot.t('new_subresource')}
            </NavLink>
        </div>
    </div>
));

const InnerSidebarComponent = ({
    hasPublishedDataset,
    hasLoadedDataset,
    p: polyglot,
}) => {
    return (
        <>
            <Route path="/display">
                <div style={styles.sidebar} className="sidebar">
                    <Box style={styles.iconLinkContainer}>
                        <NavLink
                            style={styles.sidebarNavLink}
                            activeStyle={styles.sidebarNavLinkActive}
                            to="/display/dataset"
                        >
                            <HomeIcon fontSize="large" />
                            <br />
                            {polyglot.t('home')}
                        </NavLink>
                    </Box>
                    <Box style={styles.iconLinkContainer}>
                        <NavLink
                            style={styles.sidebarNavLink}
                            activeStyle={styles.sidebarNavLinkActive}
                            to="/display/document"
                        >
                            <DescriptionIcon fontSize="large" />
                            <br />
                            {polyglot.t('resource_pages')}
                        </NavLink>
                    </Box>
                    <Box style={styles.iconLinkContainer}>
                        <NavLink
                            style={styles.sidebarNavLink}
                            activeStyle={styles.sidebarNavLinkActive}
                            to="/display/graph"
                        >
                            <EqualizerIcon fontSize="large" />
                            <br />
                            {polyglot.t('graph_pages')}
                        </NavLink>
                    </Box>
                </div>
                <Route path="/display/document">
                    <DocumentMenu />
                </Route>
            </Route>
            <Route path="/data">
                <div style={styles.sidebar} className="sidebar">
                    <Box style={styles.iconLinkContainer}>
                        <NavLink
                            style={styles.sidebarNavLink}
                            activeStyle={styles.sidebarNavLinkActive}
                            to="/data/existing"
                        >
                            <Box>
                                <p>
                                    <GridOnIcon fontSize="large" />
                                    <br />
                                    {polyglot.t('data')}
                                </p>
                            </Box>
                        </NavLink>
                    </Box>
                    {hasLoadedDataset && (
                        <Box style={styles.iconLinkContainer}>
                            <NavLink
                                style={styles.sidebarNavLink}
                                activeStyle={styles.sidebarNavLinkActive}
                                to="/data/add"
                            >
                                <Box>
                                    <p>
                                        <AddBoxIcon fontSize="large" />
                                        <br />
                                        {polyglot.t('add_more')}
                                    </p>
                                </Box>
                            </NavLink>
                        </Box>
                    )}
                    {hasPublishedDataset && (
                        <Box style={styles.iconLinkContainer}>
                            <NavLink
                                style={{
                                    marginTop: 'auto',
                                    ...styles.sidebarNavLink,
                                }}
                                activeStyle={styles.sidebarNavLinkActive}
                                to="/data/removed"
                            >
                                <Box>
                                    <p>
                                        <DeleteIcon fontSize="large" />
                                        <br />
                                        {polyglot.t('removed_resources')}
                                    </p>
                                </Box>
                            </NavLink>
                        </Box>
                    )}
                </div>
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
