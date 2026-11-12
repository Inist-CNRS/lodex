module.exports = {
    apps: [
        {
            name: 'lodex',
            // compiled by `npm run build` (packages/api/build.mjs)
            script: './dist/index.js',
            interpreter: 'node',
            // Before an OOM crash: heap snapshot + diagnostic report in /tmp (same place as the CPU lag profiles)
            interpreter_args:
                '--enable-source-maps --max-http-header-size=32768 --heapsnapshot-near-heap-limit=1 --report-on-fatalerror --diagnostic-dir=/tmp',
            exec_mode: 'cluster',
            cwd: './packages/api',
            wait_ready: true,
            listen_timeout: 10000,
            env: {
                NODE_CONFIG_DIR: '../../config',
            },
            err_file: '/dev/null',
            out_file: '/dev/null',
        },
        {
            name: 'worker',
            script: './src/index.ts',
            cwd: './packages/workers',
            interpreter: 'node',
            exec_mode: 'fork',
            instances: 1,
            env: {
                NODE_CONFIG_DIR: '../../config',
            },
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
