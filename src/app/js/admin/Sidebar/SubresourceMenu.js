import React from 'react';
import { Box, Button } from '@mui/material';
import PlusIcon from '@mui/icons-material/Add';
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
                width: 220,
                paddingTop: '64px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: colorsTheme.white.primary,
                position: 'sticky',
                top: 0,
                height: '100vh',
                overflowY: 'auto',
                borderRight: '1px solid #e0e0e0',
            }}
        >
            <Button
                component={NavLink}
                size="small"
                color="primary"
                sx={{
                    borderWidth: '2px',
                    borderStyle: 'dashed',
                    textTransform: 'none',
                    marginTop: '20px',
                    marginX: '10px',
                }}
                to="/display/document/add"
                startIcon={<PlusIcon />}
            >
                {polyglot.t('new_subresource')}
            </Button>
            <Box
                sx={{ marginTop: '20px' }}
                display="flex"
                flexDirection="column"
            >
                {(subresources || []).map(subresource => (
                    <Box
                        key={subresource._id}
                        component={NavLink}
                        sx={{
                            width: '100%',
                            textTransform: 'none',
                            textDecoration: 'none',
                            padding: '10px 20px',
                            color: colorsTheme.black.primary,
                            '&:hover': {
                                textDecoration: 'none',
                                transition: 'all ease-in-out 400ms',
                                color: colorsTheme.green.primary,
                                backgroundColor: colorsTheme.green.light,
                            },
                            '&.active': {
                                color: colorsTheme.green.primary,
                                backgroundColor: colorsTheme.green.light,
                            },
                        }}
                        activeClassName="active"
                        to={`/display/document/${subresource._id}`}
                    >
                        {subresource.name}
                    </Box>
                ))}
            </Box>
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
