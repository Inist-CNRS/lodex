const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        supportFile: 'cypress/support/index.js',
        experimentalStudio: true,
        retries: process.env.CI ? 2 : 0,
    },
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    defaultCommandTimeout: 30000,
    execTimeout: 30000,
    taskTimeout: 30000,
    pageLoadTimeout: 30000,
    requestTimeout: 30000,
    responseTimeout: 30000,
});
