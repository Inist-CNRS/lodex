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

export const postResource = async ctx => {
    const newResource = ctx.request.body;
    const result = await ctx.resource.create(newResource);

    if (result) {
        ctx.body = result;
        return;
    }

    ctx.status = 500;
};

export const putResource = async (ctx, id) => {
    const newResource = ctx.request.body;

    try {
        ctx.body = await ctx.resource.update(id, newResource);
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: error.message };
        return;
    }
};

export const getAllResources = async ctx => {
    ctx.body = await ctx.resource.findAll();
};

const app = new Koa();

app.use(setup);

app.use(route.get('/', getAllResources));
app.use(koaBodyParser());
app.use(route.post('/', postResource));
app.use(route.put('/:id', putResource));

export default app;
