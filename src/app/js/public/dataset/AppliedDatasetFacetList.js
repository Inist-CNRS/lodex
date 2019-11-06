import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fromDataset } from '../selectors';
import AppliedFacetList from '../facet/AppliedFacetList';
import AppliedFacet from './AppliedDatasetFacet';
import { facetActions } from '.';

export const AppliedDatasetFacetListComponent = ({ facets, clearAll }) => (
    <AppliedFacetList facets={facets} clearAll={clearAll}>
        <AppliedFacet />
    </AppliedFacetList>
);

AppliedDatasetFacetListComponent.propTypes = {
    facets: PropTypes.arrayOf(PropTypes.any).isRequired,
    clearAll: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    facets: fromDataset.getAppliedFacetList(state),
});

const mapDispatchToProps = {
    clearAll: () => facetActions.clearFacet(),
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AppliedDatasetFacetListComponent);
