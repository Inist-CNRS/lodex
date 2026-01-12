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
    mongo: {
        host: process.env.MONGO_HOST || 'localhost:27017', // see  docker-compose.dev.yml
        dbName: 'lodex',
    },
    host: process.env.EZMASTER_PUBLIC_URL || 'http://localhost:3000',
    jsHost: 'http://localhost:8080',
    jsHosts: {
        rootAdmin: 'http://localhost:8081',
        admin: 'http://localhost:8082',
        public: 'http://localhost:8083',
    },
    themesHost: process.env.EZMASTER_PUBLIC_URL || 'http://localhost:3000',
};
