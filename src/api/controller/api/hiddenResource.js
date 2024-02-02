import Koa from 'koa';
import route from 'koa-route';

const app = new Koa();

const getExportHiddenResources = async ctx => {
    const hiddenResources = await ctx.hiddenResource.findAll();
    ctx.body = JSON.stringify(hiddenResources);
    ctx.status = 200;
};

app.use(route.get('/export', getExportHiddenResources));

export default app;
