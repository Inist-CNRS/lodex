import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

import translations from './src/api/services/translations';
import { loaders } from './config.json';

export default defineConfig(({ mode }) => {
    const isDevelopment = mode === 'development';

    return {
        root: 'src/app/js',
        build: {
            outDir: '../build',
            emptyOutDir: true,
            sourcemap: isDevelopment,
            target: ['chrome107', 'edge107', 'firefox104', 'safari16'],
            rollupOptions: {
                input: {
                    public: resolve(__dirname, 'src/app/js/public/index.ts'),
                    admin: resolve(__dirname, 'src/app/js/admin/index.ts'),
                    'root-admin': resolve(
                        __dirname,
                        'src/app/js/root-admin/index.ts',
                    ),
                    embeddedIstexSummary: resolve(
                        __dirname,
                        'src/app/js/embeddedIstexSummary/index.tsx',
                    ),
                },
                output: {
                    entryFileNames: (chunkInfo) => {
                        if (chunkInfo.name === 'embeddedIstexSummary') {
                            // we need to keep same path as on ezmaster
                            return 'embeddedIstexSummary.js';
                        }
                        return '[name]/index.js';
                    },
                    chunkFileNames: '[name]/index.js',
                    assetFileNames: 'css/[name].[ext]',
                    manualChunks: undefined,
                },
                plugins: [
                    !process.env.CI &&
                        visualizer({
                            filename: resolve(__dirname, 'stats.html'),
                        }),
                ],
            },
        },

        server: {
            port: 8080,
            host: '0.0.0.0',
            hmr: {
                overlay: false,
            },
        },

        plugins: [
            react({
                jsxRuntime: 'automatic',
                include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
            }),
        ],

        define: {
            __DEBUG__: false,
            __EN__: JSON.stringify(translations.getByLanguage('english')),
            __FR__: JSON.stringify(translations.getByLanguage('french')),
            LOADERS: JSON.stringify(loaders),
            'process.env.NODE_ENV': JSON.stringify(mode),
        },

        resolve: {
            alias: {
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

        css: {
            modules: {
                localsConvention: 'camelCase',
            },
        },

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
            exclude: [],
        },
    };
});
