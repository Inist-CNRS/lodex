module.exports = {
    apps: [
        {
            name: 'lodex',
            script: 'src/api/index.js',
            interpreter_args:
                '--max-http-header-size=32768 --require @babel/register',
            exec_mode: 'cluster',
            error_file: '/dev/stderr',
            out_file: null,
            pid_file: '/app',
        },
        {
            name: 'worker',
            script: 'workers',
            interpreter_args: '--require @babel/register',
            exec_mode: 'fork',
            instances: 1,
            error_file: '/dev/stderr',
            out_file: null,
            pid_file: '/app',
        },
    ],
};
