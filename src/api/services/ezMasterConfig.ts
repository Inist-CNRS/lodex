import expect from 'expect';
import config from '../../../config.json';

export const validateConfig = (config: any) => {
    if (config.naan) {
        expect(config.naan).toMatch(/(\d{5,})/);
    }

    if (config.subpublisher) {
        expect(config.subpublisher).toMatch(
            /[0123456789ABCDFGHJKLMNPQRSTVWXZ]{3}/,
        );
    }
};

export default async (ctx: any, next: any) => {
    try {
        validateConfig(config);

        ctx.ezMasterConfig = config;
    } catch (err) {
        const error = new Error(
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            `Invalid configuration from EzMaster: ${err.message}`,
        );
        throw error;
    }

    await next();
};
