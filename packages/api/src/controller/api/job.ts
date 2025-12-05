import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';
import { getOrCreateWorkerQueue } from '../../workers';
import { cancelJob, clearJobs } from '../../workers/tools';

export const setup = async (ctx: any, next: any) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
    }
};

export const getJobLogs = async (ctx: any, id: any) => {
    ctx.body = await getOrCreateWorkerQueue(ctx.tenant, 1).getJobLogs(id);
};

export const postCancelJob = async (ctx: any, type: any) => {
    const { subLabel } = ctx.request.body;
    cancelJob(ctx, type, subLabel);
    ctx.status = 200;
};

export const postClearJobs = async (ctx: any) => {
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
