import 'babel-polyfill';
import config from 'config';
import {
    DefinePlugin,
    SourceMapDevToolPlugin,
    HotModuleReplacementPlugin,
    NamedModulesPlugin,
} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import { resolve } from 'path';

import { loaderKeys } from '../api/loaders';
import jsonConfig from '../../config.json';

export default {
    entry: {
        index: []
            .concat(
                process.env.NODE_ENV === 'development'
                    ? [
                          'react-hot-loader/patch',
                          'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
                      ]
                    : [],
            )
            .concat([resolve(__dirname, './js/public/index.js')]),
        'admin/index': []
            .concat(
                process.env.NODE_ENV === 'development'
                    ? [
                          'react-hot-loader/patch',
                          'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
                      ]
                    : [],
            )
            .concat([resolve(__dirname, './js/admin/index.js')]),
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
                options: {
                    cacheDirectory: true,
                    forceEnv: 'browser',
                    presets: ['react', 'stage-2'],
                },
            },
            {
                test: /\.json$/,
                include: [resolve(__dirname, '../../config.json')],
                loader: 'json-loader',
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
            API_URL: JSON.stringify(config.api_url),
            __DEBUG__: config.debug,
            'process.env': {
                NODE_ENV:
                    process.env.NODE_ENV === 'development'
                        ? JSON.stringify(process.env.NODE_ENV)
                        : JSON.stringify('production'), // eslint-disable-line max-len
                ISTEX_API_URL: JSON.stringify(config.istexApiUrl),
                PER_PAGE: JSON.stringify(jsonConfig.perPage),
            },
            LOADERS: JSON.stringify(loaderKeys),
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve(__dirname, './custom/index.html'),
            chunks: ['index'],
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'admin/index.html',
            template: resolve(__dirname, './admin.html'),
            chunks: ['admin/index'],
            inject: 'body',
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
    ].concat(
        process.env.NODE_ENV === 'development'
            ? [
                  // prints more readable module names in the browser console on HMR updates
                  new NamedModulesPlugin(),
                  new HotModuleReplacementPlugin(),
                  new SourceMapDevToolPlugin({ filename: '[file].map' }),
              ]
            : [
                  new HardSourceWebpackPlugin(),
                  new UglifyJsPlugin({
                      uglifyOptions: {
                          ie8: false,
                          beautify: false,
                          comments: false,
                          sourceMap: false,
                      },
                      exclude: /node_modules/,
                      parallel: true,
                      cache: true,
                  }),
                  new CompressionPlugin(),
              ],
    ),
    resolve: {
        modules: [resolve(__dirname, '../../node_modules')],
        alias: {
            config: resolve(__dirname, './webpackConfig.js'),
        },
    },
};
