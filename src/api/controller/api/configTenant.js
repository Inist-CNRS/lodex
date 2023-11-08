import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';

export const setup = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
};
export const putConfigTenant = async (ctx, id) => {
    const newConfigTenant = ctx.request.body;

    try {
        const configTenant = await ctx.configTenantCollection.findOneById(id);
        if (!configTenant) {
            ctx.status = 404;
            ctx.body = { error: 'Not found' };
            return;
        }
        ctx.body = await ctx.configTenantCollection.update(id, newConfigTenant);
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: error.message };
        return;
    }
};

export const getConfigTenant = async ctx => {
    ctx.body = await ctx.configTenantCollection.findLast();
};

const app = new Koa();

app.use(setup);
app.use(route.get('/', getConfigTenant));
app.use(koaBodyParser());
app.use(route.put('/:id', putConfigTenant));

export default app;
