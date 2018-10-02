import 'babel-polyfill';
import fs from 'fs';
import CSV from 'csv-string';
import { loaders } from '../../config.json';
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
import { resolve } from 'path';

const isDevelopment = process.env.NODE_ENV === 'development';

const translationsFile = resolve(__dirname, './translations.tsv');
const translationsTSV = fs.readFileSync(translationsFile, 'utf8');
const translationsRAW = CSV.parse(translationsTSV, `\t`, '"');
export const translations = {
    english: translationsRAW.reduce(
        (acc, line) => ({ ...acc, [line[0]]: line[1] }),
        {},
    ),
    french: translationsRAW.reduce(
        (acc, line) => ({ ...acc, [line[0]]: line[2] }),
        {},
    ),
};

export default {
    entry: {
        index: [
            isDevelopment && 'react-hot-loader/patch',
            isDevelopment &&
                'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
            resolve(__dirname, './js/public/index.js'),
        ].filter(Boolean),
        'admin/index': [
            isDevelopment && 'react-hot-loader/patch',
            isDevelopment &&
                'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
            resolve(__dirname, './js/admin/index.js'),
        ].filter(Boolean),
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
            __EN__: JSON.stringify(translations.english),
            __FR__: JSON.stringify(translations.french),
            'process.env': {
                NODE_ENV: JSON.stringify(
                    isDevelopment ? process.env.NODE_ENV : 'production',
                ),
            },
            LOADERS: JSON.stringify(loaders),
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

        // prints more readable module names in the browser console on HMR updates
        isDevelopment && new NamedModulesPlugin(),
        isDevelopment && new HotModuleReplacementPlugin(),
        isDevelopment && new SourceMapDevToolPlugin({ filename: '[file].map' }),

        // Production plugins
        !isDevelopment &&
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
        !isDevelopment && new CompressionPlugin(),
    ].filter(Boolean),
    resolve: {
        modules: [resolve(__dirname, '../../node_modules')],
    },
};
