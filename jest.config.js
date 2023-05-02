module.exports = {
    projects: [
        {
            displayName: 'frontend',
            rootDir: `${__dirname}/src/app`,
            setupFiles: [`${__dirname}/src/app/setupTest.js`],
            testMatch: ['/**/*.spec.js'],
            moduleNameMapper: {
                '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
            },
        },
        {
            displayName: 'api',
            rootDir: `${__dirname}/src/api`,
            testEnvironment: 'node',
            testPathIgnorePatterns: ['e2e'],
            testMatch: ['/**/*.spec.js'],
        },
        {
            displayName: 'common',
            rootDir: `${__dirname}/src/common`,
            testMatch: ['/**/*.spec.js'],
        },
        {
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
            preset: '@shelf/jest-mongodb',
            transformIgnorePatterns: [
                '<rootDir>/node_modules/',
                '/node_modules/(?!quick-lru)',
            ],
            testTimeout: 8000,
        },
    ],
};
