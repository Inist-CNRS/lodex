const transform = {
    '\\.[tj]sx?$': [
        'babel-jest',
        {
            configFile: `${__dirname}/babel.config.js`,
        },
    ],
};

const workerIdleMemoryLimit = '1024MB';
const testMatch = ['/**/*.spec.js', '/**/*.spec.ts', '/**/*.spec.tsx'];

module.exports = {
    workerIdleMemoryLimit,
    projects: [
        {
            displayName: 'frontend',
            rootDir: `${__dirname}/src/app`,
            setupFiles: [`${__dirname}/src/app/setupTest.js`],
            testMatch,
            moduleNameMapper: {
                '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
            },
            moduleFileExtensions: [
                'js',
                'json',
                'jsx',
                'mjs',
                'ts',
                'tsx',
                'mts',
            ],
            transformIgnorePatterns: ['<rootDir>/node_modules/d3'],
            transform,
            testEnvironment: 'jsdom',
            workerIdleMemoryLimit,
        },
        {
            preset: '@shelf/jest-mongodb',
            displayName: 'api',
            rootDir: `${__dirname}/src/api`,
            testEnvironment: 'node',
            testPathIgnorePatterns: ['e2e'],
            testMatch,
            transform,
            workerIdleMemoryLimit,
        },
        {
            displayName: 'common',
            rootDir: `${__dirname}/src/common`,
            transform,
            testMatch,
            workerIdleMemoryLimit,
        },
        {
            displayName: 'transformers',
            rootDir: `${__dirname}/packages/transformers`,
            testMatch,
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
            moduleNameMapper: {},
            testMatch: [
                '**/test?(s)/**/*.[jt]s?(x)',
                '**/__tests__/**/*.[jt]s?(x)',
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
