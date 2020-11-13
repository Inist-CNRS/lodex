import React from 'react';
import { Box } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import DescriptionIcon from '@material-ui/icons/Description';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import GridOnIcon from '@material-ui/icons/GridOn';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';

import { polyglot as polyglotPropTypes } from '../propTypes';
import PrivateRoute from './PrivateRoute';
import { fromPublication, fromParsing } from './selectors';
import UploadButton from './upload/UploadButton';

const styles = {
    root: {
        width: 140,
        paddingTop: 100,
        marginLeft: -10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    linkContainer: {
        fontSize: 18,
        width: 125,
        height: 125,
        lineHeight: '20px',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        textAlign: 'center',
        padding: 20,
        color: '#ddd',
        textDecoration: 'none',
        '&::before': {
            content: 'ssss',
        },
    },
    activeLinkContainer: {
        color: '#000',
    },
};

const InnerSidebarComponent = ({
    hasPublishedDataset,
    hasLoadedDataset,
    p: polyglot,
}) => (
    <>
        <Route path="/display">
            <div style={styles.root} className="sidebar">
                <Box style={styles.linkContainer}>
                    <NavLink
                        style={{ color: '#ccc' }}
                        activeStyle={{ color: 'black' }}
                        to="/display/home"
                    >
                        <HomeIcon fontSize="large" />
                        <br />
                        {polyglot.t('home')}
                    </NavLink>
                </Box>
                <Box style={styles.linkContainer}>
                    <NavLink
                        style={{ color: '#ccc' }}
                        activeStyle={{ color: 'black' }}
                        to="/display/resource"
                    >
                        <DescriptionIcon fontSize="large" />
                        <br />
                        {polyglot.t('resource_pages')}
                    </NavLink>
                </Box>
                <Box style={styles.linkContainer}>
                    <NavLink
                        style={{ color: '#ccc' }}
                        activeStyle={{ color: 'black' }}
                        to="/display/graph"
                    >
                        <EqualizerIcon fontSize="large" />
                        <br />
                        {polyglot.t('graph_pages')}
                    </NavLink>
                </Box>
            </div>
        </Route>
        <Route path="/data">
            <div style={styles.root} className="sidebar">
                <NavLink
                    to="/data"
                    activeStyle={styles.activeLinkContainer}
                    style={styles.linkContainer}
                >
                    <Box>
                        <p>
                            <GridOnIcon fontSize="large" />
                            <br />
                            {polyglot.t('data')}
                        </p>
                    </Box>
                </NavLink>
                {hasLoadedDataset && (
                    <UploadButton>
                        <Box
                            style={{
                                ...styles.linkContainer,
                                cursor: 'pointer',
                                color: '#000',
                            }}
                        >
                            <p>
                                <AddBoxIcon fontSize="large" />
                                <br />
                                <span>{polyglot.t('add_more')}</span>
                            </p>
                        </Box>
                    </UploadButton>
                )}
                {hasPublishedDataset && (
                    <NavLink
                        activeStyle={styles.activeLinkContainer}
                        style={{ ...styles.linkContainer, marginTop: 'auto' }}
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
                )}
            </div>
        </Route>
    </>
);

InnerSidebarComponent.propTypes = {
    hasPublishedDataset: PropTypes.bool.isRequired,
    hasLoadedDataset: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
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
