import asyncBusboy from '@recuperateur/async-busboy';
import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';
import moment from 'moment';
import streamToString from 'stream-to-string';
import tar from 'tar-stream';
import { v1 as uuid } from 'uuid';

import { validateField } from '../../models/field';
import indexSearchableFields from '../../services/indexSearchableFields';
import { mongoConnectionString } from '../../services/mongoClient';
import publishFacets from './publishFacets';

import {
    Overview,
    SCOPE_COLLECTION,
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
    SCOPE_GRAPHIC,
} from '@lodex/common';
import { ObjectId } from 'mongodb';
import { restoreEnrichments } from '../../services/enrichment/enrichment';
import generateUid from '../../services/generateUid';
import { restorePrecomputed } from '../../services/precomputed/precomputed';
import { restoreModel } from '../../services/restoreModel';
import { ENRICHER } from '../../workers/enricher';
import { PRECOMPUTER } from '../../workers/precomputer';
import { dropJobs } from '../../workers/tools';
import { transformField } from './field.transformer';
import { workerQueues } from '../../workers';
import { PUBLISHER } from '../../workers/publisher';

const sortByFieldUri = (a: any, b: any) =>
    (a.name === 'uri' ? -1 : a.position) - (b.name === 'uri' ? -1 : b.position);

export const restoreFields = (fileStream: any, ctx: any) => {
    if (!fileStream.filename.endsWith('.tar')) {
        return streamToString(fileStream)
            .then((fieldsString: any) => JSON.parse(fieldsString))
            .then((fields: any) => {
                ctx.field
                    .deleteMany({})
                    .then(() =>
                        Promise.all(
                            fields
                                .sort(sortByFieldUri)
                                .map((field: any, index: any) =>
                                    translateOldField(ctx, field, index),
                                ),
                        ),
                    );
            });
    }

    const restoreTask = () => {
        dropJobs(ctx.tenant, ENRICHER);
        dropJobs(ctx.tenant, PRECOMPUTER);

        return restoreModel(mongoConnectionString(ctx.tenant), fileStream, [
            'field',
            'subresource',
            'enrichment',
            'precomputed',
        ]);
    };

    return ctx.field
        .deleteMany({})
        .then(restoreTask)
        .then(() =>
            Promise.all([
                ctx.field.castIds(),
                ctx.subresource.castIds(),
                restoreEnrichments(ctx),
                restorePrecomputed(ctx),
            ]),
        );
};

export const translateOldField = (ctx: any, oldField: any, index: any) => {
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

export const setup = async (ctx: any, next: any) => {
    ctx.validateField = validateField;
    ctx.publishFacets = publishFacets;
    ctx.restoreFields = restoreFields;

    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
    }
};

export const getAllField = async (ctx: any) => {
    ctx.body = await ctx.field.findAll();
};

export const postField = async (ctx: any) => {
    const newField = transformField(ctx.request.body);

    const { searchable } = newField;

    const result = await ctx.field.create(newField);
    if (searchable) {
        await indexSearchableFields(ctx);
    }

    if (result) {
        ctx.body = result;
        return;
    }

    ctx.status = 500;
};

export const patchField = async (ctx: any, id: any) => {
    const newField = transformField(ctx.request.body);

    try {
        ctx.body = await ctx.field.updateOneById(id, newField);
        await indexSearchableFields(ctx);
    } catch (error) {
        ctx.status = 403;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }

    if ((await ctx.publishedDataset.countAll()) > 0) {
        await ctx.publishFacets(ctx, [ctx.body], false);
    }
};

const SORTABLE_FIELDS = [
    Overview.RESOURCE_TITLE,
    Overview.RESOURCE_DESCRIPTION,
    Overview.RESOURCE_DETAIL_1,
    Overview.RESOURCE_DETAIL_2,
    Overview.RESOURCE_DETAIL_3,
];

export const patchOverview = async (ctx: any) => {
    const { _id, overview, subresourceId } = ctx.request.body;

    try {
        if (_id && !SORTABLE_FIELDS.includes(overview)) {
            await ctx.field.updateOne(
                { _id: new ObjectId(_id) },
                { $unset: { isDefaultSortField: '', sortOrder: '' } },
            );
        } else {
            await ctx.field.updateOne(
                { overview, subresourceId, _id: { $ne: _id } },
                { $unset: { isDefaultSortField: '', sortOrder: '' } },
            );
        }

        await ctx.field.updateMany(
            {
                overview,
                subresourceId,
            },
            { $unset: { overview: '' } },
        );
        if (_id) {
            ctx.body = await ctx.field.updateOneById(_id, { overview });
        } else {
            ctx.body = { status: 'success' };
        }
    } catch (error) {
        ctx.status = 403;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }
};

export const patchSortField = async (ctx: any) => {
    const { _id, sortOrder = 'asc' } = ctx.request.body;

    try {
        await ctx.field.updateMany(
            {},
            {
                $unset: { isDefaultSortField: '', sortOrder: '' },
            },
        );
        if (_id) {
            ctx.body = await ctx.field.updateOneById(_id, {
                isDefaultSortField: true,
                sortOrder,
            });
        } else {
            ctx.body = { status: 'success' };
        }
    } catch (error) {
        ctx.status = 400;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { status: 'error', error: error.message };
        return;
    }
};

export const patchSortOrder = async (ctx: any) => {
    const { sortOrder } = ctx.request.body;

    try {
        await ctx.field.updateOne(
            {
                isDefaultSortField: true,
            },
            {
                $set: { sortOrder },
            },
        );

        ctx.body = { status: 'success' };
    } catch (error) {
        ctx.status = 400;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { status: 'error', error: error.message };
        return;
    }
};

export const patchSearchableFields = async (ctx: any) => {
    const fields = ctx.request.body;

    try {
        const ids = fields.map((field: any) => new ObjectId(field._id));
        await ctx.field.updateMany(
            { _id: { $in: ids } },
            { $set: { searchable: true } },
        );

        await ctx.field.updateMany(
            { _id: { $nin: ids } },
            { $set: { searchable: false } },
        );

        await indexSearchableFields(ctx);
        ctx.body = 'ok';
    } catch (error) {
        ctx.status = 403;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }

    if ((await ctx.publishedDataset.countAll()) > 0) {
        await ctx.publishFacets(ctx, [ctx.body], false);
    }
};

export const removeField = async (ctx: any, id: any) => {
    ctx.body = await ctx.field.removeById(id);
    await indexSearchableFields(ctx);
};

export const exportFields = async (ctx: any) => {
    const filename = `model_${moment().format('YYYY-MM-DD-HHmmss')}.tar`;
    ctx.set('Content-disposition', `attachment; filename=${filename}`);
    ctx.set('Content-type', 'application/x-tar');
    try {
        const collections = [
            'field',
            'subresource',
            'enrichment',
            'precomputed',
        ];
        const pack = tar.pack();

        for (const collection of collections) {
            let projection = {};
            if (collection === 'precomputed') {
                projection = { hasData: 0, status: 0, callId: 0, jobId: 0 };
            }

            const docs = await ctx.db
                .collection(collection)
                .find({}, { projection })
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
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = e.message;
    }
};

export const importFields = (asyncBusboyImpl: any) => async (ctx: any) => {
    const { files } = await asyncBusboyImpl(ctx.req);
    const fileStream = files[0];

    try {
        await ctx.restoreFields(fileStream, ctx);
        const enrichments = await ctx.enrichment.findAll();
        const precomputed = await ctx.precomputed.findAll();

        ctx.body = {
            message: 'Model imported successfully',
            hasEnrichments: enrichments?.length > 0,
            hasPrecomputed: precomputed?.length > 0,
        };
        ctx.status = 200;
    } catch (e) {
        ctx.status = 500;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = e.message;
    }
};

export const reorderField = async (ctx: any) => {
    const { fields } = ctx.request.body;

    const fieldsDict = await ctx.field.findByNames(fields);
    const fieldsData = fields.map((name: any) => fieldsDict[name]);

    try {
        fieldsData.reduce((prev: any, { scope }: any) => {
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
            fields.map((name: any, position: any) =>
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
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            error: error.message,
        };
    }
};

export const duplicateField = async (ctx: any) => {
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

        ctx.body = await ctx.field.updateOneById(newField._id, newField);
        await indexSearchableFields(ctx);
        if (newField.searchable) {
            await indexSearchableFields(ctx);
        }

        await workerQueues[ctx.tenant].add(
            PUBLISHER, // Name of the job
            { jobType: PUBLISHER, tenant: ctx.tenant },
            { jobId: uuid() },
        );
        ctx.status = 200;
        ctx.body = newField;
    } catch (error) {
        ctx.status = 400;
        ctx.body = {
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            error: error.message,
        };
        return;
    }
};

export const dropFieldCollection = async (ctx: any) => {
    try {
        // drop field collection except the uri field from scope collection
        await ctx.field.drop();
        await ctx.field.initializeModel();
        const collectionNames = await ctx.db.listCollections().toArray();
        if (collectionNames.map((c: any) => c.name).includes('subresource')) {
            await ctx.subresource.drop();
        }
        ctx.status = 200;
        ctx.body = { message: 'model_cleared' };
    } catch (error) {
        ctx.status = 400;
        ctx.body = {
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
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
app.use(route.patch('/searchable', patchSearchableFields));
app.use(route.patch('/overview', patchOverview));
app.use(route.patch('/sort-field', patchSortField));
app.use(route.patch('/sort-order', patchSortOrder));
app.use(route.patch('/:id', patchField));
app.use(route.del('/:id', removeField));

export default app;
