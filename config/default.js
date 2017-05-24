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
        host: 'mongo:27017',
        dbName: 'lodex',
    },
    auth: {
        cookieSecret: 'cookie',
        headerSecret: 'header',
        expiresIn: 10 * 3600, // 10 hours
    },
    /** Remove when api turn to v5 */
    istexApiUrl: 'https://api-v5.istex.fr/document',
    hostname: 'http://data.istex.fr/',
    host: getHost(),
    uploadDir: 'upload',
};
