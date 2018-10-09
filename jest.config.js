module.exports = {
    projects: [
        {
            displayName: 'frontend',
            rootDir: `${__dirname}/src/app`,
            setupFiles: [`${__dirname}/src/app/setupTest.js`],
            testMatch: ['/**/*.spec.js'],
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
    ],
};
