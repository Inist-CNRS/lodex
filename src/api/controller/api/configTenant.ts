// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module 'koa-bodyparser'. Did you mean ... Remove this comment to see the full error message
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
