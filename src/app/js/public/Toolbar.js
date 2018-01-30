import React from 'react';

import FacetList from './facet/FacetList';
import Filter from './dataset/Filter';

export const ToolbarComponent = () => (
    <div>
        <Filter />
        <FacetList />
    </div>
);

export default ToolbarComponent;
