import Koa from 'koa';
import koaWebpack from 'koa-webpack';
import copyCustomization from './copyCustomization';

let customizationApplied = false;
let koaWebpackMiddleware = null;

export default () => {
    const app = new Koa();

    app.use(async (ctx, next) => {
        if (!customizationApplied) {
            customizationApplied = true;

            await copyCustomization();
        }

        const webpackConfig = require('../../../app/webpack.config.babel').default; // eslint-disable-line

        if (!koaWebpackMiddleware) {
            koaWebpackMiddleware = koaWebpack({
                config: webpackConfig,
                dev: {
                    publicPath: webpackConfig.output.publicPath,
                    headers: {
                        'Content-Type': 'text/html; charset=utf-8',
                    },
                    stats: {
                        colors: true,
                    },
                    quiet: false,
                    noInfo: true,
                },
                hot: {
                    log: console.log,
                    path: '/__webpack_hmr',
                    heartbeat: 10 * 1000,
                },
            });
        }

        await koaWebpackMiddleware(ctx, next);
    });

    return app;
};
