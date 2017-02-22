import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import webpack from 'webpack';

let frontendBuilt = false;

export const buildWithWebpack = new Promise((resolve, reject) => {
    const webpackConfig = require('../../../app/webpack.config.babel').default; // eslint-disable-line

    webpack(webpackConfig, (error) => {
        if (error) return reject(error);

        return resolve();
    });
});

export const buildFrontend = async (ctx, next) => {
    if (!frontendBuilt) {
        frontendBuilt = true;

        try {
            await buildWithWebpack();
        } catch (error) {
            frontendBuilt = false;
            console.error(JSON.stringify(error, null, 4));
        }
    }

    await next();
};

export default () => {
    const app = new Koa();

    app.use(buildFrontend);
    app.use(serve(path.join(__dirname, '../../../build')));

    return app;
};
