import expect from 'expect';

export const validateConfig = config => {
    expect(config).toMatchObject({
        username: /.+/,
        password: /.+/,
    });

    if (config.userAuth) {
        expect(config.userAuth).toMatchObject({
            username: /.+/,
            password: /.+/,
        });
    }

    if (config.naan) {
        expect(config.naan).toMatchObject(/(\d{5,})/);
    }

    if (config.subpublisher) {
        expect(config.subpublisher).toMatchObject(
            /[0123456789BCDFGHJKLMNPQRSTVWXZ]{3}/,
        );
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
