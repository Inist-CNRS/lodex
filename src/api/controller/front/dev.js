import Koa from 'koa';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfig from '../../../app/webpack.config.babel';

const compiler = webpack(webpackConfig);
const app = new Koa();

app.use(async (ctx, next) => {
    await webpackDevMiddleware(compiler, { publicPath: '/' })(ctx.req, {
        end: (content) => {
            ctx.body = content;
        },
        setHeader: (name, value) => {
            ctx.headers[name] = value;
        },
    }, next);
});

export default app;
