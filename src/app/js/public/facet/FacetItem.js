import React from 'react';
import PropTypes from 'prop-types';
import { ListItem } from 'material-ui/List';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import getFieldClassName from '../../lib/getFieldClassName';
import { fromFacet } from '../selectors';
import { openFacet } from './index';
import { field as fieldPropType } from '../../propTypes';
import FacetValueList from './FacetValueList';

const styles = {
    nested: {
        padding: '0px 0px 8px',
    },
};

const PureFacetItem = ({ onClick, isOpen, field, total }) => (
    <ListItem
        className={`facet-item facet-${getFieldClassName(field)}`}
        nestedListStyle={styles.nested}
        key={field.name}
        primaryText={`${field.label} ${total ? `(${total})` : ''}`}
        onClick={onClick}
        onNestedListToggle={onClick}
        open={isOpen}
        nestedItems={[
            <FacetValueList key="list" name={field.name} label={field.label} />,
        ]}
    />
);

PureFacetItem.propTypes = {
    onClick: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    field: fieldPropType.isRequired,
    total: PropTypes.number,
};

const mapStateToProps = (state, { field }) => ({
    isOpen: fromFacet.isFacetOpen(state, field.name),
    total: fromFacet.getFacetValuesTotal(state, field.name),
});

const mapDispatchtoProps = {
    openFacet,
};

export default compose(
    connect(mapStateToProps, mapDispatchtoProps),
    withHandlers({
        onClick: ({ openFacet, field: { name } }) => () => openFacet({ name }),
    }),
)(PureFacetItem);
