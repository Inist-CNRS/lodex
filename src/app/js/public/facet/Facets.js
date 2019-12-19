import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import FacetList from './FacetList';

const Facets = ({ className, page }) => (
    <div className={classnames(className, 'facets')}>
        <FacetList page={page} />
    </div>
);

Facets.propTypes = {
    className: PropTypes.string,
    page: PropTypes.string.isRequired,
};

Facets.defaultProps = {
    className: '',
};

export default Facets;
