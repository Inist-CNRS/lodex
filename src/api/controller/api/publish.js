import Koa from 'koa';
import route from 'koa-route';

import clearPublished from '../../services/clearPublished';
import { publisherQueue, PUBLISH } from '../../workers/publisher';


const app = new Koa();

export const doPublish = async ctx => {
    publisherQueue.add(PUBLISH);
    ctx.status = 200;
    ctx.body = {
        status: 'success',
    };
};

export const handleClearPublished = async ctx => {
    try {
        await clearPublished(ctx);
        ctx.body = {
            status: 'success',
        };
    } catch (error) {
        console.log(error);
        ctx.body = {
            status: 'error',
        };
    }
};

app.use(route.post('/', doPublish));

app.use(route.delete('/', handleClearPublished));

export default app;
