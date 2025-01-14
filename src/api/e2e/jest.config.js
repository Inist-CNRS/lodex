module.exports = {
    testEnvironment: 'node',
    transform: {
        '\\.[jt]sx?$': [
            'babel-jest',
            {
                configFile: `${__dirname}/../../../babel.config.js`,
            },
        ],
    },
};
