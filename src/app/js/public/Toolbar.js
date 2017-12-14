import React from 'react';

import FacetList from './facet/FacetList';
import Filter from './dataset/Filter';
import Stats from './Stats';

export const ToolbarComponent = () => (
    <div>
        <Stats />
        <Filter />
        <FacetList />
    </div>
);

export default ToolbarComponent;
