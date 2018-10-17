import 'babel-polyfill';
import fs from 'fs';
import CSV from 'csv-string';
import {
    DefinePlugin,
    SourceMapDevToolPlugin,
    HotModuleReplacementPlugin,
} from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import { resolve } from 'path';

import { loaders } from '../../config.json';

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
    mode: isDevelopment ? 'development' : 'production',
    entry: {
        index: [
            isDevelopment && 'react-hot-loader/patch',
            resolve(__dirname, './js/public/index.js'),
        ].filter(Boolean),
        'admin/index': [
            isDevelopment && 'react-hot-loader/patch',
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
            LOADERS: JSON.stringify(loaders),
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
        isDevelopment && new HotModuleReplacementPlugin(),
        isDevelopment && new SourceMapDevToolPlugin({ filename: '[file].map' }),

        // Production plugins
        !isDevelopment && new CompressionPlugin(),
    ].filter(Boolean),
    resolve: {
        modules: [resolve(__dirname, '../../node_modules')],
    },
};
