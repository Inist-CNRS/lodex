import React, { Fragment } from 'react';
import { Box } from '@material-ui/core';
import PlusIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromEnrichments } from '../selectors';
import colorsTheme from '../../../custom/colorsTheme';

const useStyles = makeStyles({
    sidebarNavLink: {
        color: colorsTheme.white.primary,
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: 20,
        '&:hover': {
            transition: 'all ease-in-out 400ms',
            textDecoration: 'none',
            color: colorsTheme.white.primary,
            backgroundColor: colorsTheme.black.light,
        },
    },
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
    subSidebar: {
        width: 200,
        paddingTop: 64,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: colorsTheme.black.dark,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'scroll',
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
        borderTop: `1px solid ${colorsTheme.white.transparent}`,
    },
});

const subSidebarNavLinkActiveStyle = {
    color: colorsTheme.white.primary,
    backgroundColor: colorsTheme.white.transparent,
};

const EnrichmentMenu = ({ p: polyglot, enrichments }) => {
    const classes = useStyles();
    return (
        <div className={classnames(classes.subSidebar, 'sub-sidebar')}>
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
            {(enrichments || []).map(e => (
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
        </div>
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
