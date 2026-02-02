module.exports = {
    port: 3000,
    mongo: {
        dbName: String(
            process.env.MONGO_DATABASE_PREFIX ||
                process.env.EZMASTER_TECHNICAL_NAME ||
                'lodex',
        ).replace(/(-[^-]*)-[0-9]+$/, '$1'),
    },
    auth: {
        cookieSecret: 'cookie',
        headerSecret: 'header',
        expiresIn: 10 * 3600, // 10 hours
    },
    cache: {
        max: 500,
        maxAge: 60 * 60, // 1 hour
    },
    ezs: {
        verbose: 'ezs:*,-ezs:debug', // ezs:*,-ezs:debug,-ezs:trace
        cacheEnable: true,
    },
    mail: {
        host: 'smtpout.intra.inist.fr',
        port: 25,
        from: 'noreply@inist.fr',
    },
};
