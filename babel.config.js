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
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import',
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
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-object-rest-spread',
            ],
        },
    },
};
