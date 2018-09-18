import React from 'react';
import { Route } from 'react-router-dom';

import Resource from './Resource';

const ResourceRoutes = () => (
    <div>
        <Route path="/resource" component={Resource} />
        <Route path="/ark:/:naan/:rest" component={Resource} />
        <Route path="/uid:/:uri" component={Resource} />
    </div>
);

export default ResourceRoutes;
