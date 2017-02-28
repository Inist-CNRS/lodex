module.exports = {
    port: 3000,
    mongo: {
        host: process.env.EZMASTER_MONGODB_HOST_PORT,
        dbName: process.env.EZMASTER_TECHNICAL_NAME,
    },
    auth: {
        cookieSecret: 'cookie',
        headerSecret: 'header',
        expiresIn: 10 * 3600, // 10 hours
    },
    buildFrontend: true,
};
