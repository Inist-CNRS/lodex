import config from '../config.json';

const PORT = 3000;

const getHost = () => {
    if (config.host) {
        return config.host;
    }

    const host = process.env.EZMASTER_PUBLIC_URL || `http://localhost:${PORT}`;
    return host;
};

const getCleanHost = () => {
    const host = process.env.EZMASTER_PUBLIC_URL || `http://localhost:${PORT}`;
    const reg = new RegExp('(\\-\\d+)(\\.[a-z0-9]+)+');
    const match = reg.exec(host);

    if (match) {
        return host.replace(match[1], '');
    }
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
    hostname: 'http://data.istex.fr/',
    host: getHost(),
    cleanHost: getCleanHost(),
    uploadDir: 'upload',
};
