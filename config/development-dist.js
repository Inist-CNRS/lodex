module.exports = {
    port: 3000,
    logs: true,
    auth: {
        username: 'user',
        password: 'secret',
        cookieSecret: 'cookie',
        headerSecret: 'header',
        expiresIn: 10 * 3600 // 10 hours
    },
};
