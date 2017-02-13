import Koa from 'koa';
import route from 'koa-route';

import { validateField } from '../../models/field';

export const setup = async (ctx, next) => {
    ctx.validateField = validateField;
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = error.message;
    }
};

export const getAllField = async (ctx) => {
    ctx.body = await ctx.field.findAll();
};

export const postField = async (ctx) => {
    const newField = ctx.request.body;
    try {
        await ctx.validateField(newField);
    } catch (error) {
        ctx.body = error.message;
        ctx.status = 500;
        return;
    }

    const result = await ctx.field.insertOne(newField);

    if (result.ops && result.ops.length) {
        ctx.body = await ctx.field.findOneById(result.ops[0]._id);
        return;
    }

    ctx.status = 500;
};

export const putField = async (ctx, id) => {
    const newField = ctx.request.body;
    try {
        await ctx.validateField(newField);
    } catch (error) {
        ctx.body = error.message;
        ctx.status = 500;
        return;
    }

    ctx.body = await ctx.field.updateOneById(id, newField);
};

export const removeField = async (ctx, id) => {
    ctx.body = await ctx.field.removeById(id);
};

const app = new Koa();

app.use(setup);

app.use(route.get('/', getAllField));
app.use(route.post('/', postField));
app.use(route.put('/:id', putField));
app.use(route.del('/:id', removeField));

export default app;
