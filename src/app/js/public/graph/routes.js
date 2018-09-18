import React from 'react';
import { Route } from 'react-router-dom';

import GraphPage from './GraphPage';

const GraphRoutes = () => (
    <div>
        <Route path="/graph" component={GraphPage} />
        <Route path="/graph/:name" component={GraphPage} />
    </div>
);

export default GraphRoutes;
