module.exports = {
    port: 3000,
    logs: true,
    auth: {
        cookieSecret: 'cookie',
        headerSecret: 'header',
        expiresIn: 10 * 3600, // 10 hours
    },
    mongo: {
        host: 'mongo:27017',
        dbName: 'lodex',
    },
};
