const {
    DefinePlugin,
    SourceMapDevToolPlugin,
    HotModuleReplacementPlugin,
} = require('webpack');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { resolve } = require('path');

const { loaders } = require('../../config.json');

const isDevelopment = process.env.NODE_ENV === 'development';
const isAnalyze = process.env.NODE_ENV === 'analyze';

const translations = require('../api/services/translations');

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    entry: {
        index: resolve(__dirname, './js/public/index.js'),
        'admin/index': resolve(__dirname, './js/admin/index.js'),
        'root-admin/index': resolve(__dirname, './js/root-admin/index.js'),
        embeddedIstexSummary: resolve(
            __dirname,
            './js/embeddedIstexSummary/index.js',
        ),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    resolve(__dirname, './js'),
                    resolve(__dirname, '../common'),
                    resolve(__dirname, '../../node_modules/react-vega'),
                    resolve(__dirname, '../../node_modules/vega'),
                    resolve(__dirname, '../../node_modules/vega-*'),
                ],
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, '../build'),
        publicPath: '/',
    },
    plugins: [
        new DefinePlugin({
            __DEBUG__: false,
            __EN__: JSON.stringify(translations.getByLanguage('english')),
            __FR__: JSON.stringify(translations.getByLanguage('french')),
            LOADERS: JSON.stringify(loaders),
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: resolve(__dirname, './custom'),
                    to: resolve(__dirname, '../build'),
                    globOptions: {
                        ignore: [
                            '/index.html',
                            '/admin/index.js',
                            '/root-admin/index.js',
                            '/index.js',
                            '/0.js',
                        ],
                    },
                },
            ],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: resolve(__dirname, './lodex.png'),
                    to: resolve(__dirname, '../build'),
                },
            ],
        }),

        // prints more readable module names in the browser console on HMR updates
        isDevelopment && new HotModuleReplacementPlugin(),
        isDevelopment && new SourceMapDevToolPlugin({ filename: '[file].map' }),

        // Production plugins
        !isDevelopment && new CompressionPlugin(),

        // Analyze plugins
        isAnalyze && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
    resolve: {
        modules: [resolve(__dirname, '../../node_modules')],
        alias: {
            // Because lodash.isarray which has been deprecated,
            // react-infinite can't work properly
            // This workaround avoid to install an extra polyfill to fix the issue
            'lodash.isarray': resolve(
                __dirname,
                '../../node_modules/react-infinite/node_modules/lodash.isarray/index.js',
            ),
        },
    },
};
