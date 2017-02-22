import App from './App';
import Home from './Home';

import resourceRoutes from './resource/routes';
import userRoutes from '../user/routes';

export default store => ({
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/home') },
    childRoutes: [
        { path: '/home', component: Home },
        ...userRoutes,
        ...resourceRoutes(store),
    ],
});
