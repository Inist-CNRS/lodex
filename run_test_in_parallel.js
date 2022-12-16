const { exec } = require('child_process');
const util = require('util');
const execPromisified = util.promisify(exec);

const baseCommand = 'npx cypress run --env coverage=false --spec ';

const specs = ['cypress/integration/*.spec.*'];

const runCypressSpec = async command => {
    try {
        const { stdout, stderr } = await execPromisified(command);
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
        return Promise.resolve();
    } catch (e) {
        console.error(e);
        return Promise.reject(e);
    }
};

const runAllTests = async () => {
    const promises = specs.map(spec => {
        const specRunCommand = baseCommand + spec;
        return runCypressSpec(specRunCommand);
    });
    console.log('all spec runs started');
    try {
        console.time('all tests');
        // using Promise.all waiting for
        // all successful execution of test cases
        await Promise.all(promises);
        console.timeEnd('all tests');
        // Continuous Integration expects 0 for success case
        return 0;
    } catch (e) {
        console.error(e);
        // Continuous Integration expects non-zero for failure case
        return 255;
    }
};

runAllTests();
