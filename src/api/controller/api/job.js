import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import { workerQueue, cleanWaitingJobsOfType } from '../../workers';
import clearPublished from '../../services/clearPublished';
import progress from '../../services/progress';

export const setup = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
};

export const getJobLogs = async (ctx, queue, id) => {
    ctx.body = await workerQueue.getJobLogs(id);
};

export const cancelJob = async (ctx, type) => {
    const activeJob = (await workerQueue.getActive())[0];
    if (activeJob?.data?.jobType === type) {
        await cleanWaitingJobsOfType(activeJob.data.jobType);
        activeJob.moveToFailed(new Error('cancelled'), true);
        clearPublished(ctx);
        progress.finish();
    }

    ctx.status = 200;
};

const app = new Koa();
app.use(setup);
app.use(route.get('/:id/logs', getJobLogs));
app.use(route.post('/:type/cancel', cancelJob));
app.use(koaBodyParser());

export default app;
