module.exports = {
    apps: [
        {
            name: 'lodex',
            script: 'packages/api/src',
            interpreter: 'node',
            interpreter_args: '--import tsx --max-http-header-size=32768',
            exec_mode: 'cluster',
            wait_ready: true,
            listen_timeout: 10000,
            err_file: '/dev/null',
            out_file: '/dev/null',
        },
        {
            name: 'worker',
            script: 'packages/workers/src',
            interpreter: 'node',
            interpreter_args: '--import tsx',
            exec_mode: 'fork',
            instances: 1,
            err_file: '/dev/null',
            out_file: '/dev/null',
        },
        {
            name: 'redis',
            script: 'redis-server',
            exec_mode: 'fork',
            instances: 1,
            err_file: '/dev/null',
            out_file: '/dev/null',
        },
    ],
};
