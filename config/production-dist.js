module.exports = {
    port: 3000,
    mongo: {
        host: process.env.EZMASTER_MONGODB_HOST_PORT,
        dbName: process.env.EZMASTER_TECHNICAL_NAME,
    }
};
