module.exports = {
    port: 3000,
    mongo: {
        host: 'localhost:27017',
        dbName: 'lodex',
    },
    auth: {
        cookieSecret: 'cookie',
        headerSecret: 'header',
        expiresIn: 10 * 3600, // 10 hours
    },
};
