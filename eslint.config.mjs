import babelParser from '@babel/eslint-parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import cypress from 'eslint-plugin-cypress';
import importPlugin from 'eslint-plugin-import';
import pluginJest from 'eslint-plugin-jest';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
    globalIgnores([
        'src/themes/**/*.js',
        'src/app/custom/themes/**/js/*.js',
        'node_modules',
        '**/build',
        'packages/transformers',
        'packages/@recuperateur',
        'packages/ezsLodex/lib',
    ]),
    {
        name: 'eslint-js-recommended-rules',
        plugins: {
            js,
        },
        extends: ['js/recommended'],
        rules: {
            'no-use-before-define': 'warn',
            'no-unused-vars': [
                'error',
                {
                    ignoreRestSiblings: true,
                    argsIgnorePattern: '^_',
                    caughtErrors: 'none',
                },
            ],
        },
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                babelOptions: {
                    configFile: path.resolve(__dirname, 'babel.config.js'),
                },
            },
        },
    },
    tseslint.configs.recommended.map((conf) => ({
        ...conf,
        files: ['**/*.ts', '**/*.tsx'],
        ignores: ['**/.js', '**/*.jsx'],
        rules: {
            ...conf.rules,
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-expressions': 'warn',

            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    ignoreRestSiblings: true,
                    argsIgnorePattern: '^_',
                    caughtErrors: 'none',
                },
            ],
        },
    })),
    {
        name: 'eslint-plugin-import',
        plugins: { import: importPlugin },
        rules: {
            ...importPlugin.configs.recommended.rules,
            ...importPlugin.configs.typescript.rules,
        },
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
                typescript: true,
            },
        },
    },
    eslintPluginPrettierRecommended,
    {
        name: 'react',
        files: [
            'src/**/*.js',
            'src/**/*.jsx',
            'src/**/*.ts',
            'src/**/*.tsx',
            'config/*.js',
            'packages/*/src/**/*.js',
            'packages/*/src/**/*.jsx',
            'packages/*/src/**/*.ts',
            'packages/*/src/**/*.tsx',
            '*.js',
        ],
        ...react.configs.flat.recommended,
        rules: {
            ...react.configs.flat.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
        },
        plugins: { react },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                cy: true,
                process: true,
                __DEBUG__: true,
                LOADERS: true,
                __EN__: true,
                __FR__: true,
                ISTEX_API_URL: true,
                beforeAll: true,
                afterAll: true,
            },

            ecmaVersion: 7,
            sourceType: 'module',
        },
        settings: {
            version: '17.0',
        },
    },
    reactHooks.configs['recommended-latest'],
    {
        files: [
            '**/*.spec.js',
            '**/*.spec.jsx',
            '**/*.test.ts',
            '**/*.test.tsx',
        ],
        plugins: { jest: pluginJest },
        languageOptions: {
            globals: pluginJest.environments.globals.globals,
        },
        rules: {
            ...pluginJest.configs['flat/recommended'].rules,
            'jest/no-done-callback': 'warn',
            'jest/no-disabled-tests': 'warn',
            'jest/no-focused-tests': 'error',
            'jest/prefer-to-have-length': 'warn',
            'jest/valid-expect': 'error',
            'jest/no-conditional-expect': 'warn',
            'jest/no-identical-title': 'warn',
            'jest/no-standalone-expect': [
                'error',
                { additionalTestBlockFunctions: ['beforeEach'] },
            ],
        },
    },
    {
        files: ['cypress/e2e/**/*.cy.js'],
        plugins: {
            cypress,
        },
        languageOptions: {
            globals: {
                cy: true,
                it: true,
                describe: true,
                beforeEach: true,
            },
        },
        rules: {
            ...cypress.configs.recommended.rules,
            'cypress/no-unnecessary-waiting': 'warn',
        },
    },
]);
