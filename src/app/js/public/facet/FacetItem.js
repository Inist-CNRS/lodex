import React from 'react';
import PropTypes from 'prop-types';
import { ListItem } from 'material-ui/List';
import { connect } from 'react-redux';

import getFieldClassName from '../../lib/getFieldClassName';
import { field as fieldPropType } from '../../propTypes';
import FacetValueList from './FacetValueList';
import FacetActionsContext from './FacetActionsContext';

const styles = {
    nested: {
        padding: '0px 0px 8px',
    },
};

const onClick = (openFacet, field) => () => openFacet({ name: field.name });

const FacetItem = ({ isOpen, field, total, ...rest }) => (
    <FacetActionsContext.Consumer>
        {({ openFacet }) => (
            <ListItem
                className={`facet-item facet-${getFieldClassName(field)}`}
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
                        {...rest}
                    />,
                ]}
            />
        )}
    </FacetActionsContext.Consumer>
);

FacetItem.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    field: fieldPropType.isRequired,
    total: PropTypes.number,
};

const mapStateToProps = (
    state,
    { field, isFacetOpen, getFacetValuesTotal },
) => ({
    isOpen: isFacetOpen(state, field.name),
    total: getFacetValuesTotal(state, field.name),
});

export default connect(mapStateToProps)(FacetItem);
