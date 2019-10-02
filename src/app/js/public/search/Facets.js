import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import FacetList from '../facet/FacetList';

const Facets = ({ className }) => (
    <div className={classnames(className, 'facets')}>
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
