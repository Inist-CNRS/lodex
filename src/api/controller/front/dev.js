import Koa from 'koa';
import koaWebpack from 'koa-webpack';

import webpackConfig from '../../../app/webpack.config.babel';

const app = new Koa();

app.use(koaWebpack({
    config: webpackConfig,
    dev: {
        publicPath: webpackConfig.output.publicPath,
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
}));

export default app;
