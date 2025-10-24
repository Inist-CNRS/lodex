const transform = {
    '\\.[jt]sx?$': [
        'babel-jest',
        {
            configFile: `${__dirname}/babel.config.js`,
        },
    ],
};

const workerIdleMemoryLimit = '2048MB';

module.exports = {
    workerIdleMemoryLimit,
    projects: [
        {
            displayName: 'frontend',
            rootDir: `${__dirname}/src/app`,
            setupFiles: [`${__dirname}/src/app/setupTest.ts`],
            setupFilesAfterEnv: [`${__dirname}/src/app/setupTestAfterEnv.ts`],
            testMatch: [
                '/**/*.spec.js',
                '/**/*.spec.jsx',
                '/**/*.spec.tsx',
                '/**/*.spec.ts',
            ],
            testPathIgnorePatterns: ['build'],
            moduleNameMapper: {
                '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
            },
            moduleFileExtensions: ['js', 'json', 'jsx', 'mjs', 'ts', 'tsx'],
            transformIgnorePatterns: ['<rootDir>/node_modules/d3'],
            transform,
            testEnvironment: 'jsdom',
            workerIdleMemoryLimit,
        },
        {
            preset: '@shelf/jest-mongodb',
            displayName: 'api',
            rootDir: `${__dirname}/packages/api/src`,
            testEnvironment: 'node',
            testPathIgnorePatterns: ['e2e'],
            testMatch: [
                '/**/*.spec.js',
                '/**/*.spec.jsx',
                '/**/*.spec.tsx',
                '/**/*.spec.ts',
            ],
            transform,
            workerIdleMemoryLimit,
        },
        {
            displayName: 'common',
            rootDir: `${__dirname}/packages/common/src`,
            transform,
            testMatch: [
                '/**/*.spec.js',
                '/**/*.spec.jsx',
                '/**/*.spec.tsx',
                '/**/*.spec.ts',
            ],
            workerIdleMemoryLimit,
        },
        {
            displayName: 'workers',
            rootDir: `${__dirname}/workers`,
            transform,
            testMatch: [
                '/**/*.spec.js',
                '/**/*.spec.jsx',
                '/**/*.spec.tsx',
                '/**/*.spec.ts',
            ],
            workerIdleMemoryLimit,
        },
        {
            displayName: 'transformers',
            rootDir: `${__dirname}/packages/transformers`,
            testMatch: [
                '/**/*.spec.js',
                '/**/*.spec.jsx',
                '/**/*.spec.tsx',
                '/**/*.spec.ts',
            ],
            workerIdleMemoryLimit,
        },
        {
            preset: '@shelf/jest-mongodb',
            displayName: 'ezsLodex',
            rootDir: `${__dirname}/packages/ezsLodex`,
            modulePaths: ['<rootDir>/packages/ezsLodex/node_modules'],
            moduleDirectories: [
                `<rootDir>/packages/ezsLodex/node_modules`,
                'node_modules',
            ],
            moduleNameMapper: {
                '^(\\.{1,2}/.*)\\.js$': '$1',
            },
            testMatch: [
                '**/test?(s)/**/*.spec.[jt]s?(x)',
                '**/__tests__/**/*.spec.[jt]s?(x)',
                '**/?(*.)+(spec|test).[tj]s?(x)',
            ],
            testEnvironment: 'node',
            testPathIgnorePatterns: [
                '/node_modules/',
                'locals.js',
                'testOne.js',
                'testAll.js',
                '/data/',
            ],
            collectCoverage: true,
            coveragePathIgnorePatterns: [
                '/node_modules/',
                '/test/',
                '/lib/',
                '/lodex/src/reducers/',
            ],
            coverageReporters: ['lcov', 'text-summary'],
            transformIgnorePatterns: [
                '<rootDir>/node_modules/',
                '/node_modules/(?!quick-lru)',
            ],
            testTimeout: 8000,
            workerIdleMemoryLimit,
        },
    ],
};
