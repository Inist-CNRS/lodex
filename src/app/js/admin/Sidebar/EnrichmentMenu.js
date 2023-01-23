import React, { Fragment } from 'react';
import { Box } from '@mui/material';
import PlusIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromEnrichments } from '../selectors';
import colorsTheme from '../../../custom/colorsTheme';

const EnrichmentMenu = ({ p: polyglot, enrichments }) => {
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
                overflowY: 'scroll',
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
                to="/data/enrichment/add"
            >
                <PlusIcon />
                {polyglot.t('new_enrichment')}
            </Box>
            {(enrichments || []).map(e => (
                <Fragment key={e._id}>
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
                            to={`/data/enrichment/${e._id}`}
                        >
                            {e.name}
                        </Box>
                    </Box>
                </Fragment>
            ))}
        </Box>
    );
};

EnrichmentMenu.propTypes = {
    p: polyglotPropTypes.isRequired,
    enrichments: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }),
    ),
};

export default compose(
    connect(state => ({ enrichments: fromEnrichments.enrichments(state) })),
    translate,
)(EnrichmentMenu);
