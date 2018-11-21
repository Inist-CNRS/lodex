import React from 'react';

import FacetList from '../facet/FacetList';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        container: {
            padding: '1rem',
        },
    },
    'advanced-search',
);

const AdvancedSearch = () => (
    <div className={`advanced-search ${styles.container}`}>
        <FacetList page="search" />
    </div>
);

export default AdvancedSearch;
