import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import asyncBusboy from 'async-busboy';
import restore from 'mongodb-restore';
import moment from 'moment';
import streamToString from 'stream-to-string';

import { validateField } from '../../models/field';
import publishFacets from './publishFacets';
import indexSearchableFields from '../../services/indexSearchableFields';
import { mongoConnectionString } from '../../services/mongoClient';
const tar = require('tar-stream');

import {
    SCOPE_DATASET,
    SCOPE_GRAPHIC,
    SCOPE_COLLECTION,
    SCOPE_DOCUMENT,
} from '../../../common/scope';
import { PENDING } from '../../../common/enrichmentStatus';
import { dropJobs } from '../../workers/tools';
import { ENRICHER } from '../../workers/enricher';
import generateUid from '../../services/generateUid';

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
                                .map((field, index) =>
                                    translateOldField(ctx, field, index),
                                ),
                        ),
                    );
            });
    }

    const restoreTask = () => {
        dropJobs(ENRICHER);
        return new Promise((resolve, reject) =>
            restore({
                uri: mongoConnectionString,
                stream: fileStream,
                parser: 'json',
                dropCollections: ['field', 'subresource', 'enrichment'],
                callback: function(err) {
                    err ? reject(err) : resolve();
                },
            }),
        );
    };

    return ctx.field
        .remove({})
        .then(restoreTask)
        .then(() =>
            Promise.all([
                ctx.field.castIds(),
                ctx.subresource.castIds(),
                ctx.enrichment.updateMany({}, { $set: { status: PENDING } }),
            ]),
        );
};

export const translateOldField = (ctx, oldField, index) => {
    const {
        display_in_home,
        display_in_resource,
        display_in_graph,
        display_in_list,
        cover,
        name,
        ...newField
    } = oldField;
    const scope = display_in_graph && !display_in_home ? SCOPE_GRAPHIC : cover;
    const display =
        display_in_home || display_in_resource || display_in_graph
            ? true
            : false;

    if (display_in_graph && display_in_home) {
        ctx.field.create(
            {
                scope: SCOPE_GRAPHIC,
                display,
                ...newField,
                position: index,
            },
            name,
            false,
        );

        return ctx.field.create(
            {
                scope,
                display,
                ...newField,
                label: newField.label,
                transformers: [
                    {
                        operation: 'VALUE',
                        args: [
                            {
                                name: 'value',
                                type: 'string',
                                value: newField.label,
                            },
                        ],
                    },
                ],
                format: { name: 'fieldClone', args: { value: name } },
                position: index + 1,
            },
            '',
            false,
        );
    }

    return ctx.field.create(
        {
            scope,
            display,
            ...newField,
            position: index,
        },
        name,
        false,
    );
};

export const setup = async (ctx, next) => {
    ctx.validateField = validateField;
    ctx.publishFacets = publishFacets;
    ctx.restoreFields = restoreFields;

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
    ctx.set('Content-disposition', `attachment; filename=${filename}`);
    ctx.set('Content-type', 'application/x-tar');
    try {
        const collections = ['field', 'subresource', 'enrichment'];
        const pack = tar.pack();

        for (const collection of collections) {
            const docs = await ctx.db
                .collection(collection)
                .find()
                .toArray();

            for (const doc of docs) {
                await pack.entry(
                    { name: `dataset/${collection}/${doc._id}.json` },
                    JSON.stringify(doc),
                );
            }
        }

        await pack.finalize();
        ctx.status = 200;
        ctx.body = pack;
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
        fieldsData.reduce((prev, { scope }) => {
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
                return scope;
            }

            throw new Error(
                'Bad scope: trying to mix ressource fields with other fields',
            );
        }, null);

        ctx.body = await Promise.all(
            fields.map((name, position) =>
                ctx.field.updatePosition(
                    name,
                    name.endsWith('uri') ? 0 : position + 1,
                ),
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

export const duplicateField = async ctx => {
    try {
        // get field id from request body
        const { fieldId } = ctx.request.body;

        // get field from database
        const field = await ctx.field.findOneById(fieldId);

        // change name of field
        field.label = `${field.label}_copy`;
        field.name = await generateUid();
        field.position = field.position + 1;
        delete field._id;

        // save field in database
        const newField = await ctx.field.create(field);
        ctx.status = 200;
        ctx.body = newField;
    } catch (error) {
        ctx.status = 400;
        ctx.body = {
            error: error.message,
        };
    }
};

export const dropFieldCollection = async ctx => {
    try {
        // drop field collection except the uri field from scope collection
        await ctx.field.drop();
        await ctx.field.initializeModel();
        ctx.status = 200;
        ctx.body = { message: 'model_cleared' };
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
app.use(route.delete('/', dropFieldCollection));
app.use(koaBodyParser());
app.use(route.post('/', postField));
app.use(route.post('/duplicate', duplicateField));
app.use(route.put('/reorder', reorderField));
app.use(route.put('/:id', putField));
app.use(route.del('/:id', removeField));

export default app;
