const PORT = 3010;

module.exports = {
    port: PORT,
    mongo: {
        host: 'mongo:27017',
        dbName: 'lodex_test',
    },
    auth: {
        cookieSecret: 'cookie',
        headerSecret: 'header',
        expiresIn: 10 * 3600, // 10 hours
    },
    cache: {
        max: 500,
        maxAge: 60, // 1 minute
    },
    csv: {
        quote: '"',
        delimiter: ';',
    },
    buildFrontend: false,
    host: 'http://localhost:3010',
};
