import config from '../config.json';

const getHost = () => {
    if (config.host) {
        return config.host;
    }

    const { EZMASTER_PUBLIC_DOMAIN, EZMASTER_TECHNICAL_NAME } = process.env;
    if (EZMASTER_PUBLIC_DOMAIN && EZMASTER_TECHNICAL_NAME) {
        return `http://${EZMASTER_TECHNICAL_NAME}.${EZMASTER_PUBLIC_DOMAIN}`;
    }

    return null;
};

module.exports = {
    port: 3000,
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
