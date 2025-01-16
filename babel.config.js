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
        '@babel/preset-typescript',
    ],
    plugins: [
        '@babel/plugin-transform-typescript',
        '@babel/plugin-transform-class-properties',
        '@babel/plugin-transform-object-rest-spread',
        '@babel/plugin-transform-nullish-coalescing-operator',
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-transform-private-methods',
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
                '@babel/preset-typescript',
            ],
            plugins: [
                '@babel/plugin-transform-typescript',
                '@babel/plugin-transform-class-properties',
                '@babel/plugin-transform-object-rest-spread',
                '@babel/plugin-transform-nullish-coalescing-operator',
                '@babel/plugin-transform-modules-commonjs',
                '@babel/plugin-transform-private-methods',
            ],
        },
    },
};
