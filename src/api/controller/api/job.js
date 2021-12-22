import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import { enrichmentQueue } from '../../workers/enrichment';

export const setup = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
};

export const getJobLogs = async (ctx, queue, id) => {
    if (queue === 'enrichment') {
        ctx.body = await enrichmentQueue.getJobLogs(id);
    }
};

const app = new Koa();
app.use(setup);
app.use(route.get('/log/:queue/:id', getJobLogs));
app.use(koaBodyParser());

export default app;
