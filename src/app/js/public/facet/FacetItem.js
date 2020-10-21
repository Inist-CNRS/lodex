import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { ListItem, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux';

import { field as fieldPropType } from '../../propTypes';
import { fromFacet } from '../selectors';
import getFieldClassName from '../../lib/getFieldClassName';
import FacetValueList from './FacetValueList';
import FacetActionsContext from './FacetActionsContext';

const onClick = (openFacet, field) => () => openFacet({ name: field.name });

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
                onClick={onClick(openFacet, field)}
                onNestedListToggle={onClick(openFacet, field)}
                open={isOpen}
            >
                <ListItemText
                    primary={`${field.label} ${total ? `(${total})` : ''}`}
                    secondary={
                        <FacetValueList
                            name={field.name}
                            label={field.label}
                            page={page}
                        />
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
