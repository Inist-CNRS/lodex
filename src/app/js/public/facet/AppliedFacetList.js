import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fromFacet } from '../selectors';
import AppliedFacet from './AppliedFacet';
import Stats from '../Stats';

const styles = {
    container: {
        margin: '10px 0',
        display: 'flex',
        flexFlow: 'row wrap',
        width: '100%',
    },
};

export const AppliedFacetListComponent = ({ facets }) => (
    <div>
        {facets.length ? (
            <div style={styles.container}>
                {facets.map(({ name, value }) => (
                    <AppliedFacet
                        key={`${name}-${value}`}
                        name={name}
                        value={value}
                    />
                ))}
            </div>
        ) : null}
        <Stats />
    </div>
);

AppliedFacetListComponent.propTypes = {
    facets: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
    facets: fromFacet.getAppliedFacetList(state),
});

export default connect(mapStateToProps)(AppliedFacetListComponent);
