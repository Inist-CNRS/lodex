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
        '@babel/preset-typescript',
    ],
    plugins: [
        '@babel/plugin-transform-typescript',
        '@babel/plugin-transform-modules-commonjs',
    ],
};
