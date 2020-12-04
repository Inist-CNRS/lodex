import config from '../config.json';

const getMongoConfig = () => {
    const { mongo = {} } = config;

    const defaultConfig = {
        host: process.env.EZMASTER_MONGODB_HOST_PORT,
        dbName: String(process.env.EZMASTER_TECHNICAL_NAME).replace(
            /(-[0-9]+)$/,
            '',
        ),
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
    cache: {
        max: 500,
        maxAge: 60 * 60, // 1 hour
    },
    uploadDir: '/tmp/upload',
};
