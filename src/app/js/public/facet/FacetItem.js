import React from 'react';
import PropTypes from 'prop-types';
import { ListItem } from 'material-ui/List';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import getFieldClassName from '../../lib/getFieldClassName';
import { fromFacet } from '../selectors';
import { openFacet } from './index';
import {
    field as fieldPropType,
    facetValue as facetValuePropType,
} from '../../propTypes';
import FacetValueList from './FacetValueList';

const PureFacetItem = ({ onClick, isOpen, field, facetValues }) => (
    <ListItem
        className={`facet-${getFieldClassName(field)}`}
        key={field.name}
        primaryText={field.label}
        onClick={onClick}
        open={isOpen}
        nestedItems={[<FacetValueList key="list" facetValues={facetValues} />]}
        value={field}
    />
);

PureFacetItem.propTypes = {
    onClick: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    field: fieldPropType.isRequired,
    facetValues: PropTypes.arrayOf(facetValuePropType).isRequired,
};

const mapStateToProps = (state, { field }) => ({
    isOpen: fromFacet.isFacetOpen(state, field.name),
    facetValues: fromFacet.getFacetValues(state, field.name),
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
