module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
                useBuiltIns: 'entry',
            },
        ],
        '@babel/preset-react',
    ],
    plugins: [
        '@babel/plugin-transform-class-properties',
        '@babel/plugin-transform-object-rest-spread',
        '@babel/plugin-transform-nullish-coalescing-operator',
    ],
    env: {
        browser: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            browsers: ['last 2 versions'],
                        },
                        modules: false,
                        useBuiltIns: 'entry',
                    },
                ],
                '@babel/preset-react',
            ],
            plugins: [
                '@babel/plugin-transform-class-properties',
                '@babel/plugin-transform-object-rest-spread',
                '@babel/plugin-transform-nullish-coalescing-operator',
            ],
        },
    },
};
