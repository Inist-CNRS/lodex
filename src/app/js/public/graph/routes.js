import GraphPage from './GraphPage';

export default [
    {
        path: '/graph',
        component: GraphPage,
    },
    {
        path: '/graph/:name',
        component: GraphPage,
    },
];
