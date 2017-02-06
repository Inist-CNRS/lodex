import Resource from './Resource';

export default [
    {
        path: '/resource',
        component: Resource,
    },
    {
        path: '/resource/ark:/:naan/:rest',
        component: Resource,
    },
];
