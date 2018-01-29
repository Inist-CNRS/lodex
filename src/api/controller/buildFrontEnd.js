import webpack from 'webpack';

import webpackConfig from '../../app/webpack.config.babel';
import logger from '../services/logger';

let frontendBuilt = false;
let frontendBuildError = false;

export const buildFrontend = () => {
    const start = new Date();
    logger.info(`Starting webpack build.`);
    webpack(webpackConfig, error => {
        const end = new Date();
        logger.info(`Webpack done. Took ${end.getTime() - start.getTime()} ms`);
        frontendBuildError = error;
        frontendBuilt = true;
    });
};

export async function buildFrontendMiddleware(ctx, next) {
    if (!frontendBuilt) {
        ctx.body = `
The application is initializing.
Please refresh your page in a few seconds: this can take up to a minute.`;
        return;
    }

    if (frontendBuildError) {
        ctx.body = `
Error while building the frontend:\r\n
${frontendBuildError.stack}`;
        return;
    }

    await next();
}
