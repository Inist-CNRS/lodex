import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import { field as fieldPropTypes } from '../../propTypes';
import AppliedFacet from '../facet/AppliedFacet';
import { fromFields } from '../../sharedSelectors';
import { fromSearch } from '../selectors';
import { facetActions } from './reducer';

export const AppliedSearchFacetComponent = props => <AppliedFacet {...props} />;

AppliedSearchFacetComponent.propTypes = {
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    field: fieldPropTypes.isRequired,
    onRequestDelete: PropTypes.func.isRequired,
    inverted: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, { name }) => ({
    field: fromFields.getFieldByName(state, name),
    inverted: fromSearch.isFacetValuesInverted(state, name),
});

const mapDispatchToProps = { onClearFacet: facetActions.clearFacet };

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    withHandlers({
        onRequestDelete: ({ name, onClearFacet }) => () => onClearFacet(name),
    }),
)(AppliedSearchFacetComponent);
