module.exports = {
    port: 3000,
    logs: true,
    auth: {
        cookieSecret: 'cookie',
        headerSecret: 'header',
        expiresIn: 10 * 3600, // 10 hours
    },
    cache: {
        max: 500,
        maxAge: 60, // 1 minute
    },
    host: 'http://localhost:3000',
    jsHost: 'http://localhost:8080',
    jsHosts: {
        rootAdmin: 'http://localhost:8081',
        admin: 'http://localhost:8082',
        public: 'http://localhost:8083',
    },
    themesHost: 'http://localhost:3000',
};
