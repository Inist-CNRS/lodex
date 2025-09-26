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

export const postSubresource = async (ctx: any) => {
    const newResource = ctx.request.body;
    const result = await ctx.subresource.create(newResource);
    await ctx.field.initializeSubresourceModel(result);

    if (result) {
        ctx.body = result;
        return;
    }

    ctx.status = 500;
};

export const putSubresource = async (ctx: any, id: any) => {
    const newResource = ctx.request.body;

    try {
        await ctx.field.initializeSubresourceModel({ ...newResource, _id: id });
        await ctx.field.updateSubresourcePaths({ ...newResource, _id: id });

        ctx.body = await ctx.subresource.update(id, newResource);
    } catch (error) {
        ctx.status = 403;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }
};

export const deleteSubresource = async (ctx: any, id: any) => {
    try {
        await ctx.subresource.delete(id);
        await ctx.field.removeBySubresource(id);
        ctx.body = true;
    } catch (error) {
        ctx.status = 403;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }
};

export const getSubresource = async (ctx: any, id: any) => {
    ctx.body = await ctx.subresource.findOne(id);
};

export const getAllSubresources = async (ctx: any) => {
    ctx.body = await ctx.subresource.findAll();
};

const app = new Koa();

app.use(setup);

app.use(route.get('/', getAllSubresources));
app.use(route.get('/:id', getSubresource));
app.use(koaBodyParser());
app.use(route.post('/', postSubresource));
app.use(route.put('/:id', putSubresource));
app.use(route.delete('/:id', deleteSubresource));

export default app;
