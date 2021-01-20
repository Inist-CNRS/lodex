import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import asyncBusboy from 'async-busboy';
import backup from 'mongodb-backup';
import restore from 'mongodb-restore';
import moment from 'moment';
import streamToString from 'stream-to-string';

import { validateField } from '../../models/field';
import publishFacets from './publishFacets';
import indexSearchableFields from '../../services/indexSearchableFields';
import { mongoConnectionString } from '../../services/mongoClient';

import {
    SCOPE_DATASET,
    SCOPE_GRAPHIC,
    SCOPE_COLLECTION,
    SCOPE_DOCUMENT,
} from '../../../common/scope';

const sortByFieldUri = (a, b) =>
    (a.name === 'uri' ? -1 : a.position) - (b.name === 'uri' ? -1 : b.position);

export const restoreFields = (fileStream, ctx) => {
    if (!fileStream.filename.endsWith('.tar')) {
        return streamToString(fileStream)
            .then(fieldsString => JSON.parse(fieldsString))
            .then(fields => {
                ctx.field
                    .remove({})
                    .then(() =>
                        Promise.all(
                            fields
                                .sort(sortByFieldUri)
                                .map(({ name, ...field }, index) =>
                                    ctx.field.create(
                                        { ...field, position: index },
                                        name,
                                        false,
                                    ),
                                ),
                        ),
                    );
            });
    }

    return new Promise((resolve, reject) =>
        restore({
            uri: mongoConnectionString,
            stream: fileStream,
            dropCollections: ['field', 'subresource'],
            callback: function(err) {
                err ? reject(err) : resolve();
            },
        }),
    );
};

export const backupFields = writeStream =>
    new Promise((resolve, reject) =>
        backup({
            uri: mongoConnectionString,
            collections: ['field', 'subresource'],
            stream: writeStream,
            callback: err => {
                err ? reject(err) : resolve();
            },
        }),
    );

export const setup = async (ctx, next) => {
    ctx.validateField = validateField;
    ctx.publishFacets = publishFacets;
    ctx.restoreFields = restoreFields;
    ctx.backupFields = backupFields;

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

    const { searchable } = newField;

    const result = await ctx.field.create(newField);

    if (searchable) {
        await indexSearchableFields();
    }

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
        await indexSearchableFields();
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: error.message };
        return;
    }

    if ((await ctx.publishedDataset.countAll()) > 0) {
        await ctx.publishFacets(ctx, [ctx.body], false);
    }
};

export const removeField = async (ctx, id) => {
    ctx.body = await ctx.field.removeById(id);
    await indexSearchableFields();
};

export const exportFields = async ctx => {
    const filename = `model_${moment().format('YYYY-MM-DD-HHmmss')}.tar`;

    ctx.status = 200;
    ctx.set('Content-disposition', `attachment; filename=${filename}`);
    ctx.set('Content-type', 'application/x-tar');

    try {
        await ctx.backupFields(ctx.res);
    } catch (e) {
        ctx.status = 500;
        ctx.body = e.message;
    }
};

export const importFields = asyncBusboyImpl => async ctx => {
    const { files } = await asyncBusboyImpl(ctx.req);
    const fileStream = files[0];

    try {
        await ctx.restoreFields(fileStream, ctx);
        ctx.status = 200;
    } catch (e) {
        ctx.status = 500;
        ctx.body = e.message;
    }
};

export const reorderField = async ctx => {
    const { fields } = ctx.request.body;

    const fieldsDict = await ctx.field.findByNames(fields);
    const fieldsData = fields.map(name => fieldsDict[name]);

    try {
        const scope = fieldsData.reduce((prev, { scope }) => {
            if (!prev) {
                return scope;
            }

            if (prev === SCOPE_DATASET) {
                if (scope === SCOPE_DATASET) {
                    return prev;
                }

                throw new Error(
                    'Bad scope: trying to mix home fields with other fields',
                );
            }

            if (prev === SCOPE_GRAPHIC) {
                if (scope === SCOPE_GRAPHIC) {
                    return prev;
                }

                throw new Error(
                    'Bad scope: trying to mix graphic fields with other fields',
                );
            }

            if (scope === SCOPE_COLLECTION || scope === SCOPE_DOCUMENT) {
                return SCOPE_COLLECTION;
            }

            throw new Error(
                'Bad scope: trying to mix ressource fields with other fields',
            );
        }, null);

        if (scope === SCOPE_COLLECTION) {
            if (fieldsData[0].name !== 'uri') {
                throw new Error('Uri must always be the first field');
            }
        }

        ctx.body = await Promise.all(
            fields.map((name, position) =>
                ctx.field.updatePosition(name, position),
            ),
        );
        ctx.status = 200;
    } catch (error) {
        ctx.status = 400;
        ctx.body = {
            error: error.message,
        };
    }
};

const app = new Koa();

app.use(setup);

app.use(route.get('/', getAllField));
app.use(route.get('/export', exportFields));
app.use(route.post('/import', importFields(asyncBusboy)));
app.use(koaBodyParser());
app.use(route.post('/', postField));
app.use(route.put('/reorder', reorderField));
app.use(route.put('/:id', putField));
app.use(route.del('/:id', removeField));

export default app;
