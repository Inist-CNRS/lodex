import React from 'react';

import FacetList from './facet/FacetList';
import Filter from './dataset/Filter';
import Stats from './Stats';
import ExportShareButton from './ExportShareButton';

export const ToolbarComponent = () => (
    <div>
        <Stats />
        <ExportShareButton />
        <Filter />
        <FacetList />
    </div>
);

export default ToolbarComponent;
