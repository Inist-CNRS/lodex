import App from './App';
import Home from './Home';

import resourceRoutes from './resource/routes';
import userRoutes from '../user/routes';

export default {
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/home/overview') },
    childRoutes: [
        { path: '/home(/:tab)', component: Home },
        ...userRoutes,
        ...resourceRoutes,
    ],
};
