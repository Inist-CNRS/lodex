import React from 'react';
// @ts-expect-error TS7016
import { Route } from 'react-router-dom';

import GraphPage from './GraphPage';

const GraphRoutes = () => (
    <div>
        <Route path="/graph/:name" component={GraphPage} />
    </div>
);

export default GraphRoutes;
