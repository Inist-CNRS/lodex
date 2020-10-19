import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { ListItem } from '@material-ui/core';
import { connect } from 'react-redux';

import { field as fieldPropType } from '../../propTypes';
import { fromFacet } from '../selectors';
import getFieldClassName from '../../lib/getFieldClassName';
import FacetValueList from './FacetValueList';
import FacetActionsContext from './FacetActionsContext';

const styles = {
    nested: {
        padding: '0px 0px 8px',
    },
};

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
                nestedListStyle={styles.nested}
                key={field.name}
                primaryText={`${field.label} ${total ? `(${total})` : ''}`}
                onClick={onClick(openFacet, field)}
                onNestedListToggle={onClick(openFacet, field)}
                open={isOpen}
                nestedItems={[
                    <FacetValueList
                        key="list"
                        name={field.name}
                        label={field.label}
                        page={page}
                    />,
                ]}
            />
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
