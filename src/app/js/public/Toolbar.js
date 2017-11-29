import React from 'react';

import FacetSelector from './facet/FacetSelector';
import Filter from './dataset/Filter';
import Stats from './Stats';
import ExportShareButton from './ExportShareButton';

export const ToolbarComponent = () => (
    <div>
        <Stats />
        <ExportShareButton />
        <Filter />
        <FacetSelector />
    </div>
);

export default ToolbarComponent;
