import expect from 'expect';

export const validateConfig = (config) => {
    expect(config).toMatch({
        username: /.+/,
        password: /.+/,
    });

    if (config.NAAN) {
        expect(config.NAAN).toMatch(/(\d{5,})/);
    }

    if (config.subPublisherId) {
        expect(config.subPublisherId).toMatch(/[0123456789BCDFGHJKLMNPQRSTVWXZ]{3}/);
    }
};

export default async (ctx, next) => {
    try {
        const config = require('../../../config.json'); // eslint-disable-line

        validateConfig(config);

        ctx.ezMasterConfig = config;
    } catch (err) {
        const error = new Error(`Invalid configuration from EzMaster: ${err.message}`); // eslint-disable-line
        throw error;
    }


    await next();
};
