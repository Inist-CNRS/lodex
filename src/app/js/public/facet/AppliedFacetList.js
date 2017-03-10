import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

import { removeFacet as removeFacetAction } from './index';
import { facet as facetPropTypes } from '../../propTypes';
import { fromFacet } from '../selectors';
import AppliedFacet from './AppliedFacet';

export const AppliedFacetListComponent = ({ facets, removeFacet }) => (
    facets.length
    ? (
        <Toolbar>
            <ToolbarGroup firstChild>
                {facets.map(facet => (
                    <AppliedFacet key={`${facet.field.name}-${facet.value}`} facet={facet} onRemove={removeFacet} />
                ))}
            </ToolbarGroup>
        </Toolbar>
    )
    : null
);

AppliedFacetListComponent.propTypes = {
    facets: PropTypes.arrayOf(facetPropTypes).isRequired,
    removeFacet: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    facets: fromFacet.getAppliedFacets(state),
});

const mapDispatchToProps = ({ removeFacet: removeFacetAction });

export default connect(mapStateToProps, mapDispatchToProps)(AppliedFacetListComponent);
