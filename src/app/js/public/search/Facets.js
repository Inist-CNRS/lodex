import React from 'react';
import classnames from 'classnames';

import FacetList from '../facet/FacetList';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        container: {
            padding: '1rem',
        },
    },
    'facets',
);

const Facets = () => (
    <div className={classnames('facets', styles.container)}>
        <FacetList page="search" />
    </div>
);

export default Facets;
