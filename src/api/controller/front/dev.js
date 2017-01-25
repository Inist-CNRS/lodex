import Koa from 'koa';
import { devServerHost } from 'config';

import request from 'request';

const forwardRequest = ctx =>
new Promise((resolve, reject) => {
    request.get(`${devServerHost}${ctx.url}`, (error, response, body) => {
        if (error) {
            reject(error);
            return;
        }
        if (response.statusCode === 404) {
            const notFound = new Error('not found');
            notFound.status = 404;
            reject(notFound);
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
