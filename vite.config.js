import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

import translations from './src/api/services/translations';
import { loaders } from './config.json';

export default defineConfig(({ mode }) => {
    const isDevelopment = mode === 'development';

    return {
        root: 'src/app/js', // Set the root to where your HTML files are located
        // Entry points - Vite uses HTML files as entry points
        build: {
            outDir: '../build',
            emptyOutDir: true,
            sourcemap: isDevelopment,
            target: ['chrome107', 'edge107', 'firefox104', 'safari16'],
            rollupOptions: {
                input: {
                    public: resolve(__dirname, 'src/app/js/public/index.js'),
                    admin: resolve(__dirname, 'src/app/js/admin/index.js'),
                    'root-admin': resolve(
                        __dirname,
                        'src/app/js/root-admin/index.js',
                    ),
                    embeddedIstexSummary: resolve(
                        __dirname,
                        'src/app/js/embeddedIstexSummary/index.jsx',
                    ),
                },
                output: {
                    entryFileNames: (chunkInfo) => {
                        if (chunkInfo.name === 'embeddedIstexSummary') {
                            // we need to kepp same path as on ezmaster
                            return 'embeddedIstexSummary.js';
                        }
                        return '[name]/index.js';
                    },
                    chunkFileNames: '[name]/index.js',
                    assetFileNames: 'css/[name].[ext]',
                    manualChunks: undefined,
                },
            },
        },

        // Development server configuration
        server: {
            port: 8080,
            host: '0.0.0.0',
            hmr: {
                overlay: false,
            },
        },

        // Plugin configuration
        plugins: [
            react({
                jsxRuntime: 'automatic',
                include: ['**/*.js', '**/*.jsx'],
            }),
        ],

        // Global constants (replaces webpack's DefinePlugin)
        define: {
            __DEBUG__: false,
            __EN__: JSON.stringify(translations.getByLanguage('english')),
            __FR__: JSON.stringify(translations.getByLanguage('french')),
            LOADERS: JSON.stringify(loaders),
            'process.env.NODE_ENV': JSON.stringify(mode),
        },

        // Module resolution
        resolve: {
            alias: {
                // Same aliases as webpack config
                'lodash.isarray': resolve(
                    __dirname,
                    'node_modules/react-infinite/node_modules/lodash.isarray/index.js',
                ),
                'json-6': resolve(
                    __dirname,
                    'packages/transformers/node_modules/json-6/dist/index.js',
                ),
                'react-leaflet-markercluster': resolve(
                    __dirname,
                    'node_modules/react-leaflet-markercluster/dist/esm/index.js',
                ),
                '@recuperateur/resumablejs': resolve(
                    __dirname,
                    'node_modules/@recuperateur/resumablejs/resumable.js',
                ),
            },
        },

        // CSS handling
        css: {
            modules: {
                localsConvention: 'camelCase',
            },
        },

        // Optimize dependencies
        optimizeDeps: {
            include: [
                'react',
                'react-dom',
                'react-redux',
                'redux',
                'redux-saga',
                'lodash',
                'd3',
                '@mui/material',
                '@mui/icons-material',
            ],
            exclude: [
                // Exclude packages that might cause issues
            ],
        },

        // Copy static files (replaces CopyWebpackPlugin)
        publicDir: './custom',
    };
});
