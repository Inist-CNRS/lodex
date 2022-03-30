import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import { workerQueue } from '../../workers';
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
    ctx.body = await workerQueue.getJobLogs(id);
};

export const postCancelJob = async (ctx, type) => {
    cancelJob(ctx, type);
    ctx.status = 200;
};

export const postClearJobs = async ctx => {
    clearJobs();
    ctx.body = { status: 'success' };
    ctx.status = 200;
};

const app = new Koa();
app.use(setup);
app.use(route.get('/:id/logs', getJobLogs));
app.use(route.post('/:type/cancel', postCancelJob));
app.use(route.post('/clear', postClearJobs));
app.use(koaBodyParser());

export default app;
