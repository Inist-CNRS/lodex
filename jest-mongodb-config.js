module.exports = {
    mongodbMemoryServerOptions: {
        instance: {
            dbName: 'jest',
        },
        binary: {
            version: '4.4.4',
            skipMD5: true,
        },
        autoStart: false,
    },
};
