import App from './App';
import adminRoutes from './admin/routes';
import homeRoutes from './home/routes';
import userRoutes from './user/routes';
import resourceRoutes from './resource/routes';

export default store => ({
    childRoutes: [{
        path: '/',
        component: App,
        indexRoute: { onEnter: (nextState, replace) => replace('/home') },
        childRoutes: [
            ...adminRoutes(store),
            ...homeRoutes,
            ...userRoutes,
            ...resourceRoutes(store),
        ],
    }],
});
