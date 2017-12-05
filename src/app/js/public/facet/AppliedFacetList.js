import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fromFacet } from '../selectors';
import AppliedFacet from './AppliedFacet';

const styles = {
    container: {
        margin: '10px 0',
        display: 'flex',
        flexFlow: 'row wrap',
    },
};

export const AppliedFacetListComponent = ({ facets }) =>
    facets.length ? (
        <div style={styles.container}>
            {facets.map(({ name, value }) => (
                <AppliedFacet
                    key={`${name}-${value}`}
                    name={name}
                    value={value}
                />
            ))}
        </div>
    ) : null;

AppliedFacetListComponent.propTypes = {
    facets: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
    facets: fromFacet.getAppliedFacetList(state),
});

export default connect(mapStateToProps)(AppliedFacetListComponent);
