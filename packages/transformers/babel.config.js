module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
                loose: true,
            },
        ],
    ],
    plugins: [
        '@babel/plugin-transform-modules-commonjs',
    ],
};
