import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fromSearch } from '../selectors';
import AppliedFacetList from '../facet/AppliedFacetList';
import AppliedFacet from './AppliedSearchFacet';
import { facetActions } from './reducer';

export const AppliedSearchFacetListComponent = ({ facets, clearAll }) => (
    <AppliedFacetList facets={facets} clearAll={clearAll}>
        <AppliedFacet />
    </AppliedFacetList>
);

AppliedSearchFacetListComponent.propTypes = {
    facets: PropTypes.arrayOf(PropTypes.any).isRequired,
    clearAll: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    facets: fromSearch.getAppliedFacetList(state),
});

const mapDispatchToProps = {
    clearAll: () => facetActions.clearFacet(),
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AppliedSearchFacetListComponent);
