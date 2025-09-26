import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';

export const setup = async (ctx: any, next: any) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
    }
};
export const putConfigTenant = async (ctx: any, id: any) => {
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
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }
};

export const getConfigTenant = async (ctx: any) => {
    ctx.body = await ctx.configTenantCollection.findLast();
};

const app = new Koa();

app.use(setup);
app.use(route.get('/', getConfigTenant));
app.use(koaBodyParser());
app.use(route.put('/:id', putConfigTenant));

export default app;
