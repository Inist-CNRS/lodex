import React from 'react';

import FacetSelector from './facet/FacetSelector';
import AppliedFacetList from './facet/AppliedFacetList';
import Filter from './dataset/Filter';
import Stats from './Stats';
import ExportShareButton from './ExportShareButton';

export const ToolbarComponent = () => (
    <div>
        <Stats />
        <ExportShareButton />
        <Filter />
        <FacetSelector />
        <AppliedFacetList />
    </div>
);

export default ToolbarComponent;
