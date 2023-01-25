import React, { Fragment } from 'react';
import { Box } from '@mui/material';
import PlusIcon from '@mui/icons-material/Add';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import colorsTheme from '../../../custom/colorsTheme';

const SubresourceMenu = ({ p: polyglot, subresources }) => {
    return (
        <Box
            className="sub-sidebar"
            sx={{
                width: 200,
                paddingTop: '64px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: colorsTheme.black.dark,
                position: 'sticky',
                top: 0,
                height: '100vh',
                overflowY: 'auto',
                textAlign: 'center',
            }}
        >
            <Box
                component={NavLink}
                sx={{
                    color: colorsTheme.white.primary,
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '20px',
                    padding: '10px 10px',
                    border: `3px dashed ${colorsTheme.white.transparent}`,
                    borderRadius: '10px',
                    '&:hover': {
                        transition: 'all ease-in-out 400ms',
                        textDecoration: 'none',
                        color: colorsTheme.white.primary,
                        backgroundColor: colorsTheme.black.light,
                    },
                    '&.active': {
                        backgroundColor: colorsTheme.white.transparent,
                    },
                }}
                activeClassName="active"
                to="/display/document/add"
            >
                <PlusIcon />
                {polyglot.t('new_subresource')}
            </Box>
            {(subresources || []).map(subresource => (
                <Fragment key={subresource._id}>
                    <Box
                        component="hr"
                        sx={{
                            width: '90%',
                            border: 'none',
                            borderTop: `1px solid ${colorsTheme.white.transparent}`,
                        }}
                    />
                    <Box
                        sx={{
                            width: '100%',
                        }}
                    >
                        <Box
                            component={NavLink}
                            sx={{
                                color: colorsTheme.white.primary,
                                textDecoration: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                                padding: '20px',
                                '&:hover': {
                                    transition: 'all ease-in-out 400ms',
                                    textDecoration: 'none',
                                    color: colorsTheme.white.primary,
                                    backgroundColor: colorsTheme.black.light,
                                },
                                '&.active': {
                                    backgroundColor:
                                        colorsTheme.white.transparent,
                                },
                            }}
                            activeClassName="active"
                            to={`/display/document/${subresource._id}`}
                        >
                            <DocumentScannerIcon />
                            {subresource.name}
                        </Box>
                    </Box>
                </Fragment>
            ))}
        </Box>
    );
};

SubresourceMenu.propTypes = {
    p: polyglotPropTypes.isRequired,
    subresources: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }),
    ),
};

export default compose(
    connect(state => ({ subresources: state.subresource.subresources })),
    translate,
)(SubresourceMenu);
