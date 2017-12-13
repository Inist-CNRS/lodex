import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Chip from 'material-ui/Chip';

import { fromFacet } from '../selectors';
import AppliedFacet from './AppliedFacet';
import Stats from '../Stats';
import { clearFacet } from './index';

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
        <Stats />
    </div>
);

AppliedFacetListComponent.propTypes = {
    facets: PropTypes.arrayOf(PropTypes.any).isRequired,
    clearAll: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    facets: fromFacet.getAppliedFacetList(state),
});

const mapDispatchToProps = {
    clearAll: () => clearFacet(),
};

export default connect(mapStateToProps, mapDispatchToProps)(
    AppliedFacetListComponent,
);
