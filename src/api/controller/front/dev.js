import Koa from 'koa';
import koaWebpack from 'koa-webpack';

import webpackConfig from '../../../app/webpack.config.babel';

export default () => {
    const app = new Koa();

    app.use(koaWebpack({
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
    }));

    return app;
}
