module.exports = {
    port: 3000,
    mongo: {
        host: 'mongo:27017',
        dbName: 'lodex',
    },
    auth: {
        cookieSecret: 'cookie',
        headerSecret: 'header',
        expiresIn: 10 * 3600, // 10 hours
    },
    hostname: 'http://data.istex.fr/',
    uploadDir: 'upload',
};
