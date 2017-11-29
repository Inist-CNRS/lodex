import App from './App';
import Home from './Home';

import resourceRoutes from './resource/routes';
import userRoutes from '../user/routes';
import graphRoutes from './graph/routes';

export default {
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/home') },
    childRoutes: [
        { path: '/home', component: Home },
        ...userRoutes,
        ...resourceRoutes,
        ...graphRoutes,
    ],
};
