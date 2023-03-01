import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { ListItem, Grid, ListItemText } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { connect } from 'react-redux';

import { field as fieldPropType } from '../../propTypes';
import { fromFacet } from '../selectors';
import getFieldClassName from '../../lib/getFieldClassName';
import FacetValueListComponent from './FacetValueList';
import FacetActionsContext from './FacetActionsContext';
import colorsTheme from '../../../custom/colorsTheme';

const onClick = (openFacet, field) => () => openFacet({ name: field.name });

const styles = {
    facetTitle: {
        padding: '5px',
        '&:hover': {
            backgroundColor: colorsTheme.black.veryLight,
            cursor: 'pointer',
        },
    },
};

const FacetTitle = ({ title, total, isOpen }) => {
    return (
        <Grid container justify="space-between" sx={styles.facetTitle}>
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
                            <FacetValueListComponent
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

FacetTitle.propTypes = {
    title: PropTypes.string.isRequired,
    total: PropTypes.number,
    isOpen: PropTypes.bool.isRequired,
};

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
