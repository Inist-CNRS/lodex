module.exports = {
    port: 3000,
    buildFrontend: true,
    istexApiUrl: 'http://localhost:3011/document',
    mongo: {
        host: 'mongo:27017',
        dbName: 'lodex_test',
    },
};
