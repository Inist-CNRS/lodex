module.exports = {
    port: 3000,
    logs: true,
    auth: {
        cookieSecret: 'cookie',
        headerSecret: 'header',
        expiresIn: 10 * 3600 // 10 hours
    },
    devServerHost: 'http://devserver:8000',
};
