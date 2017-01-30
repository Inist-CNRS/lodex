import Koa from 'koa';
import route from 'koa-route';

import { validateField } from '../../models/field';

export const getAllField = async (ctx) => {
    ctx.body = await ctx.field.findAll();
};

export const postField = async (ctx) => {
    const newField = ctx.validateField(ctx.request.body);

    ctx.body = await ctx.field.insertOne(newField);
};

export const putField = async (ctx, name) => {
    const newField = ctx.validateField(ctx.request.body);

    ctx.body = await ctx.field.updateOneByName(name, newField);
};

export const removeField = async (ctx, name) => {
    ctx.body = await ctx.field.removeByName(name);
};

const app = new Koa();

app.use(async (ctx, next) => {
    ctx.validateField = validateField;
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = error.message;
    }
});

app.use(route.get('/', getAllField));
app.use(route.post('/', postField));
app.use(route.put('/:name', putField));
app.use(route.del('/:name', removeField));

export default app;
