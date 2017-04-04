import React from 'react';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

import FacetSelector from './facet/FacetSelector';
import Filter from './dataset/Filter';
import Stats from './Stats';

export const ToolbarComponent = () => (
    <Toolbar>
        <ToolbarGroup firstChild>
            <Filter />
            <FacetSelector />
        </ToolbarGroup>
        <Stats />
    </Toolbar>
);

export default ToolbarComponent;
