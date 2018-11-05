import React from 'react';
import PropTypes from 'prop-types';

import FacetList from './facet/FacetList';
import Filter from './dataset/Filter';

export const Toolbar = ({ name }) => (
    <div>
        <Filter key={name} />
        <FacetList />
    </div>
);

Toolbar.propTypes = {
    name: PropTypes.string,
};

Toolbar.defaultProps = {
    name: 'empty',
};

export default Toolbar;
