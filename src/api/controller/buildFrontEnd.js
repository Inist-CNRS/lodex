import webpack from 'webpack';

import webpackConfig from '../../app/webpack.config.babel';

let frontendBuildStarted = false;
let frontendBuilt = false;
let frontendBuildError = false;

export default async function buildFrontend(ctx, next) {
    if (!frontendBuildStarted) {
        frontendBuildStarted = true;

        webpack(webpackConfig, error => {
            frontendBuildError = error;
            frontendBuilt = true;
        });
    }

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
