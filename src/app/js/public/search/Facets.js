import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

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

const Facets = ({ className }) => (
    <div className={classnames(className, 'facets', styles.container)}>
        <FacetList page="search" />
    </div>
);

Facets.propTypes = {
    className: PropTypes.string,
};

Facets.defaultProps = {
    className: '',
};

export default Facets;
