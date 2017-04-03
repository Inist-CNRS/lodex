import config from '../config.json';

const getMongoConfig = () => {
    const { mongo = {} } = config;

    const defaultConfig = {
        host: process.env.EZMASTER_MONGODB_HOST_PORT,
        dbName: process.env.EZMASTER_TECHNICAL_NAME,
    };

    if (!mongo) {
        return defaultConfig;
    }

    return {
        host: mongo.host || defaultConfig.host,
        dbName: mongo.dbName || defaultConfig.dbName,
    };
};

module.exports = {
    port: 3000,
    mongo: getMongoConfig(),
    auth: {
        cookieSecret: 'cookie',
        headerSecret: 'header',
        expiresIn: 10 * 3600, // 10 hours
    },
    buildFrontend: true,
};
