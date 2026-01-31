module.exports = {
    mongodbMemoryServerOptions: {
        instance: {},
        binary: {
            version: '7.0.15',
            skipMD5: true,
        },
        autoStart: false,
    },
    mongoURLEnvName: 'MONGODB_URI_FOR_TESTS',
};
