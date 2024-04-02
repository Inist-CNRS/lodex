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

export const postSubresource = async (ctx) => {
    const newResource = ctx.request.body;
    const result = await ctx.subresource.create(newResource);
    await ctx.field.initializeSubresourceModel(result);

    if (result) {
        ctx.body = result;
        return;
    }

    ctx.status = 500;
};

export const putSubresource = async (ctx, id) => {
    const newResource = ctx.request.body;

    try {
        await ctx.field.initializeSubresourceModel({ ...newResource, _id: id });
        await ctx.field.updateSubresourcePaths({ ...newResource, _id: id });

        ctx.body = await ctx.subresource.update(id, newResource);
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: error.message };
        return;
    }
};

export const deleteSubresource = async (ctx, id) => {
    try {
        await ctx.subresource.delete(id);
        await ctx.field.removeBySubresource(id);
        ctx.body = true;
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: error.message };
        return;
    }
};

export const getSubresource = async (ctx, id) => {
    ctx.body = await ctx.subresource.findOne(id);
};

export const getAllSubresources = async (ctx) => {
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
