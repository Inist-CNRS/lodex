import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

import translations from '../api/src/services/translations';
import { loaders } from '../../config.json';

const port = 8083;

export default defineConfig(({ mode }) => {
    const isDevelopment = mode === 'development';

    return {
        build: {
            outDir: 'build',
            emptyOutDir: true,
            sourcemap: isDevelopment,
            target: ['chrome107', 'edge107', 'firefox104', 'safari16'],
            rollupOptions: {
                input: {
                    public: resolve(__dirname, 'src/index.ts'),
                },
                output: {
                    entryFileNames: '[name]/index.js',
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
            port: port,
            host: '0.0.0.0',
            hmr: {
                overlay: false,
            },
            proxy: {
                '/public': {
                    target: `http://localhost:${port}`,
                    rewrite: (path) => path.replace(/^\/public/, '/src'),
                },
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

        css: {
            modules: {
                localsConvention: 'camelCase',
            },
        },

        optimizeDeps: {
            include: [
                'react',
                'react-dom',
                'lodash',
                '@mui/material',
                '@mui/icons-material',
            ],
            exclude: [],
        },
    };
});
