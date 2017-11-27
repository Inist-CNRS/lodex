import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { removeFacet as removeFacetAction } from './index';
import { facet as facetPropTypes } from '../../propTypes';
import { fromFacet } from '../selectors';
import AppliedFacet from './AppliedFacet';

const styles = {
    container: {
        margin: '10px 0',
    },
};

export const AppliedFacetListComponent = ({ facets, removeFacet }) =>
    facets.length ? (
        <div style={styles.container}>
            {facets.map(facet => (
                <AppliedFacet
                    key={`${facet.field.name}-${facet.value}`}
                    facet={facet}
                    onRemove={removeFacet}
                />
            ))}
        </div>
    ) : null;

AppliedFacetListComponent.propTypes = {
    facets: PropTypes.arrayOf(facetPropTypes).isRequired,
    removeFacet: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    facets: fromFacet.getAppliedFacets(state),
});

const mapDispatchToProps = { removeFacet: removeFacetAction };

export default connect(mapStateToProps, mapDispatchToProps)(
    AppliedFacetListComponent,
);
