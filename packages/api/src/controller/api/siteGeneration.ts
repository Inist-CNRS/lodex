import Koa from 'koa';
import route from 'koa-route';
import {
    getSiteGenerationView,
    relaunchSiteGeneration,
    stopSiteGeneration,
} from '../../services/siteGeneration/siteGeneration';

export const setup = async (ctx: any, next: any) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: (error as Error).message };
    }
};

export const getSiteGeneration = async (ctx: any) => {
    ctx.body = { generation: await getSiteGenerationView(ctx) };
};

const answer = async (ctx: any, done: boolean) => {
    if (!done) {
        ctx.status = 409;
        ctx.body = { error: 'no_site_generation' };
        return;
    }
    ctx.status = 200;
    ctx.body = { ok: true };
};

export const postRelaunchSiteGeneration = async (ctx: any) =>
    answer(ctx, await relaunchSiteGeneration(ctx));

export const postStopSiteGeneration = async (ctx: any) =>
    answer(ctx, await stopSiteGeneration(ctx));

const app = new Koa();
app.use(setup);
app.use(route.get('/', getSiteGeneration));
app.use(route.post('/relaunch', postRelaunchSiteGeneration));
app.use(route.post('/stop', postStopSiteGeneration));

export default app;
