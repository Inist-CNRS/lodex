import babelParser from '@babel/eslint-parser';
// eslint-disable-next-line import/no-unresolved
import { defineConfig, globalIgnores } from 'eslint/config';
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
    },
    {
        name: 'eslint-plugin-import',
        plugins: { import: importPlugin },
        rules: {
            ...importPlugin.configs.recommended.rules,
        },
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx'],
                },
            },
        },
    },
    eslintPluginPrettierRecommended,
    {
        name: 'react',
        ...react.configs.flat.recommended,
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

            parser: babelParser,
            ecmaVersion: 7,
            sourceType: 'module',

            parserOptions: {
                babelOptions: {
                    configFile: path.resolve(__dirname, 'babel.config.js'),
                },
            },
        },
    },
    reactHooks.configs['recommended-latest'],
    {
        files: ['**/*.spec.js', '**/*.spec.jsx'],
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
