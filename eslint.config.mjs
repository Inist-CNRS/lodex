import babelParser from '@babel/eslint-parser';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import cypress from 'eslint-plugin-cypress';
import _import from 'eslint-plugin-import';
import pluginJest from 'eslint-plugin-jest';
import noOnlyTests from 'eslint-plugin-no-only-tests';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: ['src/themes/**/*.js', 'src/app/custom/themes/**/js/*.js'],
    },
    ...fixupConfigRules(
        compat.extends(
            'eslint:recommended',
            'plugin:import/errors',
            'plugin:import/warnings',
            'plugin:react/recommended',
            'prettier',
        ),
    ),
    {
        plugins: {
            import: fixupPluginRules(_import),
            react: fixupPluginRules(react),
            prettier,
            cypress,
            'no-only-tests': noOnlyTests,
        },

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

        settings: {
            react: {
                version: 'detect',
            },
        },

        rules: {
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    tabWidth: 4,
                    trailingComma: 'all',
                },
            ],

            'import/no-extraneous-dependencies': 'off',

            'no-console': [
                'error',
                {
                    allow: ['warn', 'error'],
                },
            ],

            'no-unused-vars': [
                'error',
                {
                    ignoreRestSiblings: true,
                    argsIgnorePattern: '^_',
                    caughtErrors: 'none',
                },
            ],
            'no-only-tests/no-only-tests': 'error',
            'no-use-before-define': 'error',
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
            ...pluginJest.configs['flat/recommended'],
            'jest/no-disabled-tests': 'warn',
            'jest/no-focused-tests': 'error',
            'jest/no-identical-title': 'error',
            'jest/prefer-to-have-length': 'warn',
            'jest/valid-expect': 'error',
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
];
