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
        host: 'mongo:27017',
        dbName: 'lodex',
    },
    host: process.env.EZMASTER_PUBLIC_URL || 'http://localhost:3000',
    jsHost: 'http://localhost:8080',
};
