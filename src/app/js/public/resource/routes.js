import Resource from './Resource';

export default [
    {
        path: '/resource',
        component: Resource,
    },
    {
        path: '/ark:/:naan/:rest',
        component: Resource,
    },
    {
        path: '/uid:/:uri',
        component: Resource,
    },
];
