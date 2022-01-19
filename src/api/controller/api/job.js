import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import { workerQueue, QUEUE_NAME } from '../../workers/publisher';
import clearPublished from '../../services/clearPublished';
import progress from '../../services/progress';

const GRACE_PERIOD = 0;
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

export const cancelJob = async (ctx, queue) => {
    if (queue === QUEUE_NAME) {
        await workerQueue.clean(GRACE_PERIOD, 'wait');
        const activeJobs = await workerQueue.getActive();
        activeJobs.forEach(job => {
            job.moveToFailed(new Error('cancelled'), true);
        });

        clearPublished(ctx);
        progress.finish();
        ctx.status = 200;
    }
};

const app = new Koa();
app.use(setup);
app.use(route.get('/:id/logs', getJobLogs));
app.use(route.post('/:queue/cancel', cancelJob));
app.use(koaBodyParser());

export default app;
