import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import omit from 'lodash.omit';
import asyncBusboy from 'async-busboy';
import streamToString from 'stream-to-string';

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

    const result = await ctx.field.create(newField);

    if (result) {
        ctx.body = result;
        return;
    }

    ctx.status = 500;
};

export const putField = async (ctx, id) => {
    const newField = ctx.request.body;

    ctx.body = await ctx.field.updateOneById(id, newField);
};

export const removeField = async (ctx, id) => {
    ctx.body = await ctx.field.removeById(id);
};

export const exportFields = async (ctx) => {
    const fields = await ctx.field.findAll();

    ctx.attachment('lodex_export.json');
    ctx.type = 'application/json';

    ctx.body = fields.map(f => omit(f, ['_id']));
};

export const getUploadedFields = (asyncBusboyImpl, streamToStringImpl) => async (req) => {
    const { files: [fieldsStream] } = await asyncBusboyImpl(req);

    return JSON.parse(await streamToStringImpl(fieldsStream));
};

export const importFields = getUploadedFieldsImpl => async (ctx) => {
    const fields = await getUploadedFieldsImpl(ctx.req);

    await ctx.field.remove({});
    await Promise.all(fields.map(({ name, ...field }) => ctx.field.create(field, name)));

    ctx.status = 200;
};

const app = new Koa();

app.use(setup);

app.use(route.get('/', getAllField));
app.use(route.get('/export', exportFields));
app.use(route.post('/import', importFields(getUploadedFields(asyncBusboy, streamToString))));
app.use(koaBodyParser());
app.use(route.post('/', postField));
app.use(route.put('/:id', putField));
app.use(route.del('/:id', removeField));

export default app;
