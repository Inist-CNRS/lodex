const { resolve } = require('path');
const {
    DefinePlugin,
    SourceMapDevToolPlugin,
    HotModuleReplacementPlugin,
} = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');

const { loaders } = require('../../config.json');

const isDevelopment = process.env.NODE_ENV === 'development';

const translations = require('./translations');

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    entry: {
        index: [resolve(__dirname, './js/public/index.js')],
        'admin/index': [resolve(__dirname, './js/admin/index.js')],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    resolve(__dirname, './js'),
                    resolve(__dirname, '../common'),
                ],
                loader: 'babel-loader',
            },
        ],
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, '../build'),
        publicPath: isDevelopment ? 'http://localhost:8080/' : '/',
    },
    plugins: [
        new DefinePlugin({
            __DEBUG__: false,
            __EN__: JSON.stringify(translations.english),
            __FR__: JSON.stringify(translations.french),
            LOADERS: JSON.stringify(loaders),
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
        new CopyWebpackPlugin(
            [
                {
                    from: resolve(__dirname, './custom'),
                    to: resolve(__dirname, '../build'),
                },
            ],
            {
                ignore: [
                    '/index.html',
                    '/admin/index.js',
                    '/index.js',
                    '/0.js',
                ],
            },
        ),
        new CopyWebpackPlugin([
            {
                from: resolve(__dirname, './lodex.png'),
                to: resolve(__dirname, '../build'),
            },
        ]),
        new LoadablePlugin(),

        // prints more readable module names in the browser console on HMR updates
        isDevelopment && new HotModuleReplacementPlugin(),
        isDevelopment && new SourceMapDevToolPlugin({ filename: '[file].map' }),

        // Production plugins
        !isDevelopment && new CompressionPlugin(),
    ].filter(Boolean),
    resolve: {
        modules: [resolve(__dirname, '../../node_modules')],
    },
    optimization: {
        splitChunks: {
            name: 'common',
            minChunks: Infinity,
        },
    },
};
