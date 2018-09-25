import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import omit from 'lodash.omit';
import asyncBusboy from 'async-busboy';
import streamToString from 'stream-to-string';

import { validateField } from '../../models/field';
import publishFacets from './publishFacets';

export const setup = async (ctx, next) => {
    ctx.validateField = validateField;
    ctx.publishFacets = publishFacets;
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
};

export const getAllField = async ctx => {
    ctx.body = await ctx.field.findAll();
};

export const postField = async ctx => {
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

    try {
        if (newField.overview) {
            await ctx.field.findOneAndUpdate(
                { overview: newField.overview },
                { $unset: { overview: '' } },
            );
        }
        ctx.body = await ctx.field.updateOneById(id, newField);
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: error.massage };
        return;
    }

    await ctx.publishFacets(ctx, [ctx.body]);
};

export const removeField = async (ctx, id) => {
    ctx.body = await ctx.field.removeById(id);
};

export const exportFields = async ctx => {
    const fields = await ctx.field.findAll();

    ctx.attachment('lodex_export.json');
    ctx.type = 'application/json';

    ctx.body = JSON.stringify(fields.map(f => omit(f, ['_id'])), null, 4);
};

const simplifyTransformers = field => {
    field.transformers = [
        {
            operation: 'COLUMN',
            args: [
                {
                    name: 'column',
                    type: 'column',
                    value: field.label,
                },
            ],
        },
    ];
    return field;
};

export const exportFieldsReady = async ctx => {
    const fields = await ctx.field.findAll();

    ctx.attachment('lodex_model.json');
    ctx.type = 'application/json';

    ctx.body = JSON.stringify(
        fields.map(f => omit(f, ['_id'])).map(simplifyTransformers),
        null,
        4,
    );
};

export const getUploadedFields = (
    asyncBusboyImpl,
    streamToStringImpl,
) => async req => {
    const { files: [fieldsStream] } = await asyncBusboyImpl(req);

    return JSON.parse(await streamToStringImpl(fieldsStream));
};

export const importFields = getUploadedFieldsImpl => async ctx => {
    const fields = await getUploadedFieldsImpl(ctx.req);

    await ctx.field.remove({});
    await Promise.all(
        fields.map(({ name, ...field }, index) =>
            ctx.field.create(
                { ...field, position: field.position || index },
                name,
                false,
            ),
        ),
    );

    ctx.status = 200;
};

export const reorderField = async ctx => {
    const { fields } = ctx.request.body;
    ctx.body = await Promise.all(
        fields.map((name, position) =>
            ctx.field.updatePosition(name, position),
        ),
    );
    ctx.status = 200;
};

const app = new Koa();

app.use(setup);

app.use(route.get('/', getAllField));
app.use(route.get('/export', exportFields));
app.use(route.get('/export/ready', exportFieldsReady));
app.use(
    route.post(
        '/import',
        importFields(getUploadedFields(asyncBusboy, streamToString)),
    ),
);
app.use(koaBodyParser());
app.use(route.post('/', postField));
app.use(route.put('/reorder', reorderField));
app.use(route.put('/:id', putField));
app.use(route.del('/:id', removeField));

export default app;
