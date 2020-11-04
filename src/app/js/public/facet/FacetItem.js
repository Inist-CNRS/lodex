import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { ListItem, Grid, ListItemText } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { field as fieldPropType } from '../../propTypes';
import { fromFacet } from '../selectors';
import getFieldClassName from '../../lib/getFieldClassName';
import FacetValueList from './FacetValueList';
import FacetActionsContext from './FacetActionsContext';
import theme from '../../theme';

const onClick = (openFacet, field) => () => openFacet({ name: field.name });

const useStyles = makeStyles({
    facetTitle: {
        padding: 5,
        '&:hover': {
            backgroundColor: theme.black.veryLight,
            cursor: 'pointer',
        },
    },
});

const FacetTitle = ({ title, total, isOpen }) => {
    const classes = useStyles();
    return (
        <Grid container justify="space-between" className={classes.facetTitle}>
            <Grid item>{`${title} ${total ? `(${total})` : ''}`}</Grid>
            <Grid item>{isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}</Grid>
        </Grid>
    );
};

const FacetItem = ({ className, isOpen, field, total, page }) => (
    <FacetActionsContext.Consumer>
        {({ openFacet }) => (
            <ListItem
                className={classnames(
                    className,
                    'facet-item',
                    `facet-${getFieldClassName(field)}`,
                )}
                key={field.name}
                open={isOpen}
            >
                <ListItemText
                    primary={
                        <div onClick={onClick(openFacet, field)}>
                            <FacetTitle
                                title={field.label}
                                total={total}
                                isOpen={isOpen}
                            />
                        </div>
                    }
                    secondary={
                        isOpen && (
                            <FacetValueList
                                name={field.name}
                                label={field.label}
                                page={page}
                            />
                        )
                    }
                />
            </ListItem>
        )}
    </FacetActionsContext.Consumer>
);

FacetItem.propTypes = {
    className: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    field: fieldPropType.isRequired,
    total: PropTypes.number,
    page: PropTypes.oneOf(['dataset', 'search']).isRequired,
};

const mapStateToProps = (state, { field, page }) => {
    const selectors = fromFacet(page);

    return {
        isOpen: selectors.isFacetOpen(state, field.name),
        total: selectors.getFacetValuesTotal(state, field.name),
    };
};

export default connect(mapStateToProps)(FacetItem);
