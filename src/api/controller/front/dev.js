import Koa from 'koa';
import { devServerHost } from 'config';

import request from 'request';

const forwardRequest = ctx =>
new Promise((resolve, reject) => {
    request.get(`${devServerHost}${ctx.url}`, (error, _, body) => {
        if (error) {
            reject(error);
            return;
        }
        resolve(body);
    });
});

export default () => {
    const app = new Koa();
    app.use(async (ctx) => {
        ctx.body = await forwardRequest(ctx);
    });

    return app;
};
