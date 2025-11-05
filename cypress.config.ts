import { defineConfig } from 'cypress';
import * as fs from 'fs';

const getFiles = (path: string) => {
    return fs.readdirSync(path);
};

const removeFile = (path: string) => {
    return fs.rmSync(path);
};

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        supportFile: 'cypress/support/index.ts',
        experimentalStudio: true,
        retries: process.env.CI ? 2 : 0,
        setupNodeEvents(on) {
            on('task', {
                getFileContent({
                    directory,
                    pattern,
                }: {
                    directory: string;
                    pattern: string | RegExp;
                }) {
                    const file = getFiles('cypress/downloads').find((file) =>
                        file.match(pattern),
                    );

                    const path = `${directory}/${file}`;
                    if (!file) {
                        return null;
                    }

                    const content = fs.readFileSync(path, 'utf8');
                    removeFile(path);
                    return content;
                },
            });
        },
    },
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    defaultCommandTimeout: 30000,
    execTimeout: 60000,
    taskTimeout: 60000,
    pageLoadTimeout: 60000,
    requestTimeout: 30000,
    responseTimeout: 30000,
});
