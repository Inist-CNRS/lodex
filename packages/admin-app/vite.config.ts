import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

import { loaders } from '../../config.json';
import translations from '../api/src/services/translations';

const port = 8082;

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
                    admin: resolve(__dirname, 'src/index.ts'),
                },
                output: {
                    entryFileNames: (chunkInfo) => {
                        if (chunkInfo.name === 'admin') {
                            return 'admin/index.js';
                        }
                        return 'admin-[name]/index.js';
                    },
                    chunkFileNames: 'admin-[name]/index.js',
                    assetFileNames: 'css/admin-[name].[ext]',
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
                '/admin': {
                    target: `http://localhost:${port}`,
                    rewrite: (path) => path.replace(/^\/admin/, '/src'),
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
