import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import { workerQueues } from '../../workers';
import { cancelJob, clearJobs } from '../../workers/tools';

export const setup = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
};

export const getJobLogs = async (ctx, id) => {
    ctx.body = await workerQueues[ctx.tenant].getJobLogs(id);
};

export const postCancelJob = async (ctx, type) => {
    const { subLabel } = ctx.request.body;
    cancelJob(ctx, type, subLabel);
    ctx.status = 200;
};

export const postClearJobs = async ctx => {
    clearJobs(ctx);
    ctx.body = { status: 'success' };
    ctx.status = 200;
};

const app = new Koa();
app.use(setup);
app.use(route.get('/:id/logs', getJobLogs));
app.use(koaBodyParser());
app.use(route.post('/:type/cancel', postCancelJob));
app.use(route.post('/clear', postClearJobs));

export default app;
