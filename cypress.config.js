const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        supportFile: false,
        experimentalStudio: true,
        retries: process.env.CI ? 2 : 0,
    },
    viewportWidth: 1000,
    viewportHeight: 1200,
    video: false,
    defaultCommandTimeout: 30000,
    execTimeout: 30000,
    taskTimeout: 30000,
    pageLoadTimeout: 30000,
    requestTimeout: 30000,
    responseTimeout: 30000,
});
