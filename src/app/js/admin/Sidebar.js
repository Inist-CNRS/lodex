import React from 'react';
import { Box } from '@material-ui/core';
// import HomeIcon from '@material-ui/icons/Home';
// import DescriptionIcon from '@material-ui/icons/Description';
// import EqualizerIcon from '@material-ui/icons/Equalizer';
import GridOnIcon from '@material-ui/icons/GridOn';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import ArchiveIcon from '@material-ui/icons/Archive';
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
        color: 'inherit',
        textDecoration: 'none',
        '&::before': {
            content: 'ssss',
        },
    },
};

const InnerSidebarComponent = ({
    hasPublishedDataset,
    hasLoadedDataset,
    p: polyglot,
}) => (
    <>
        {/* <Route path="/display">
            <div style={styles.root}>
                <Box style={styles.linkContainer}>
                    <p>
                        <HomeIcon fontSize="large" />
                        <br />
                        Home page
                    </p>
                </Box>
                <Box style={styles.linkContainer}>
                    <p>
                        <DescriptionIcon fontSize="large" />
                        <br />
                        Resource pages
                    </p>
                </Box>
                <Box style={styles.linkContainer}>
                    <p>
                        <EqualizerIcon fontSize="large" />
                        <br />
                        Graph
                    </p>
                </Box>
            </div>
        </Route> */}
        <Route path="/data">
            <div style={styles.root}>
                <Link to="/data" style={styles.linkContainer}>
                    <Box>
                        <p>
                            <GridOnIcon fontSize="large" />
                            <br />
                            Data
                        </p>
                    </Box>
                </Link>
                {hasLoadedDataset && (
                    <UploadButton>
                        <Box
                            style={{
                                ...styles.linkContainer,
                                cursor: 'pointer',
                            }}
                        >
                            <p>
                                <AddBoxIcon fontSize="large" />
                                <br />
                                Add more
                            </p>
                        </Box>
                    </UploadButton>
                )}
                {hasPublishedDataset && (
                    <Link
                        style={{ ...styles.linkContainer, marginTop: 'auto' }}
                        to="/data/removed"
                    >
                        <Box>
                            <p>
                                <DeleteIcon fontSize="large" />
                                <br />
                                Bin
                            </p>
                        </Box>
                    </Link>
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
