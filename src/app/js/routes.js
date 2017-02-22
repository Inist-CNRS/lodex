import App from './App';
import adminRoutes from './admin/routes';
import homeRoutes from './public/routes';
import userRoutes from './user/routes';

export default store => ({
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/home') },
    childRoutes: [
        ...adminRoutes(store),
        ...homeRoutes(store),
        ...userRoutes,
    ],
});
