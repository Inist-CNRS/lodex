import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Chip } from '@material-ui/core';

import { fromDataset } from '../selectors';
import AppliedFacet from './AppliedFacet';
import { facetActions } from '../dataset';

const styles = {
    container: {
        margin: '10px 0',
        display: 'flex',
        flexFlow: 'row wrap',
        width: '100%',
    },
    chip: {
        margin: 5,
    },
};

export const AppliedFacetListComponent = ({ facets, clearAll }) => (
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
                {facets.length && (
                    <Chip style={styles.chip} onClick={clearAll}>
                        Clear All
                    </Chip>
                )}
            </div>
        ) : null}
    </div>
);

AppliedFacetListComponent.propTypes = {
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
)(AppliedFacetListComponent);
