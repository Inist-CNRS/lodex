const PORT = 3010;

module.exports = {
    port: PORT,
    mongo: {
        host: 'localhost:27017',
        dbName: 'lodex_test',
    },
    auth: {
        cookieSecret: 'cookie',
        headerSecret: 'header',
        expiresIn: 10 * 3600, // 10 hours
    },
    csv: {
        quote: '"',
        delimiter: ';',
    },
    buildFrontend: false,
    host: `http://localhost:${PORT}`,
};
