import config from '../config.json';

const PORT = 3000;

const getHost = () => {
    if (config.host) {
        return config.host;
    }

    const host = process.env.EZMASTER_PUBLIC_URL || `http://localhost:${PORT}`;
    return host;
};

module.exports = {
    port: PORT,
    mongo: {
        host: 'localhost:27017',
        dbName: 'lodex',
    },
    auth: {
        cookieSecret: 'cookie',
        headerSecret: 'header',
        expiresIn: 10 * 3600, // 10 hours
    },
    host: getHost(),
};
