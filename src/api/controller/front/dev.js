import Koa from 'koa';
import koaWebpack from 'koa-webpack';

import webpackConfig from '../../../app/webpack.config.babel';

const app = new Koa();

app.use(koaWebpack({
    config: webpackConfig,
}));

export default app;
