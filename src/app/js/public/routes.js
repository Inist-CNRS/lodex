import Home from './Home';
import resourceRoutes from './resource/routes';

export default store => [{
    path: '/home',
    component: Home,
    childRoutes: resourceRoutes(store),
}];
