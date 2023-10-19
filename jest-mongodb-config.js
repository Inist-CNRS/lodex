module.exports = {
    mongodbMemoryServerOptions: {
        instance: {
            dbName: 'jest',
        },
        binary: {
            version: '4.4.24',
            skipMD5: true,
        },
        autoStart: false,
    },
};
