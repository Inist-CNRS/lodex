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
        display: 'flex',
        flexFlow: 'row wrap',
    },
};

export const AppliedFacetListComponent = ({ facets, removeFacet }) =>
    facets.length ? (
        <div style={styles.container}>
            {facets.map(({ name, value }) => (
                <AppliedFacet
                    key={`${name}-${value}`}
                    name={name}
                    value={value}
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
    facets: fromFacet.getAppliedFacetList(state),
});

const mapDispatchToProps = { removeFacet: removeFacetAction };

export default connect(mapStateToProps, mapDispatchToProps)(
    AppliedFacetListComponent,
);
