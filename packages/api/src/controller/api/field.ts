import config from 'config';
import { invalidateRepositories } from '../../services/repositoryMiddleware';
import asyncBusboy from '@recuperateur/async-busboy';
import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';
import moment from 'moment';
import streamToString from 'stream-to-string';
import tar from 'tar-stream';
import { randomUUID } from 'node:crypto';
import { version } from '../../../../../package.json';

import { validateField } from '../../models/field';
import { getSiteTitleKey } from '../../models/siteTitleKey';
import { getTheme } from '../../models/themes';
import {
    catalogModels,
    downloadModelArchive,
    findCatalogModel,
} from '../../services/catalogModel';
import indexSearchableFields from '../../services/indexSearchableFields';
import { mongoConnectionString } from '../../services/mongoClient';
import publishFacets from './publishFacets';

import {
    Overview,
    SCOPE_COLLECTION,
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
    SCOPE_GRAPHIC,
    type SiteInfo,
} from '@lodex/common';
import { ObjectId } from 'mongodb';
import { restoreEnrichments } from '../../services/enrichment/enrichment';
import generateUid from '../../services/generateUid';
import { restorePrecomputed } from '../../services/precomputed/precomputed';
import { CONFIG_TENANT_ENTRY, restoreModel } from '../../services/restoreModel';
import { ENRICHER } from '../../workers/enricher';
import { PRECOMPUTER } from '../../workers/precomputer';
import { dropJobs } from '../../workers/tools';
import { transformField } from './field.transformer';
import { getOrCreateWorkerQueue } from '../../workers';
import { PUBLISHER } from '../../workers/publisher';
import getLogger from '../../services/logger';

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
        .then(async ({ configTenant }: any) => {
            await Promise.all([
                ctx.field.castIds(),
                ctx.subresource.castIds(),
                restoreEnrichments(ctx),
                restorePrecomputed(ctx),
            ]);
            return applyConfigTenant(ctx, configTenant);
        });
};

// Only theme and front are exported with the model (see exportFields)
export const applyConfigTenant = async (ctx: any, imported: any) => {
    if (!imported) {
        return {};
    }

    const current = await ctx.configTenantCollection.findLast();
    if (!current) {
        return {};
    }
    const themeFound = !imported.theme || getTheme(imported.theme);

    // front.theme holds the theme's template variables: keep the current
    // ones when the imported theme cannot be applied
    const front =
        imported.front && !themeFound
            ? { ...imported.front, theme: current.front?.theme }
            : imported.front ?? current.front;

    await ctx.configTenantCollection.update(current._id, {
        ...current,
        front,
        theme: themeFound && imported.theme ? imported.theme : current.theme,
    });

    return themeFound ? {} : { themeNotFound: imported.theme };
};

// Same as the admin settings form: switching theme also resets front.theme
// to the variables of the new theme. When the restored archive already uses
// that theme, its customized variables are kept.
export const applyRecommendedTheme = async (
    ctx: any,
    theme: string,
): Promise<{ themeNotFound?: string }> => {
    const themeEntry = getTheme(theme);
    if (!themeEntry) {
        return { themeNotFound: theme };
    }

    const current = await ctx.configTenantCollection.findLast();
    // no configuration to apply the theme to, or already the right theme
    if (!current || current.theme === theme) {
        return {};
    }
    await ctx.configTenantCollection.update(current._id, {
        ...current,
        theme,
        front: { ...current.front, theme: themeEntry.customTemplateVariables },
    });

    return {};
};

const trimmedOrUndefined = (value: unknown) =>
    (typeof value === 'string' && value.trim()) || undefined;

/**
 * Write the site name and description into the theme variables, where the
 * theme settings edit them. An empty value, or a theme without the variable,
 * leaves the configuration as it is.
 */
export const applySiteInfo = async (ctx: any, siteInfo: SiteInfo) => {
    const siteName = trimmedOrUndefined(siteInfo.siteName);
    const siteDescription = trimmedOrUndefined(siteInfo.siteDescription);
    if (!siteName && !siteDescription) {
        return;
    }
    const current = await ctx.configTenantCollection.findLast();
    const themeVariables =
        current && getTheme(current.theme)?.customTemplateVariables;
    if (!themeVariables) {
        return;
    }
    const nameKey = getSiteTitleKey(themeVariables);
    const values = {
        ...(siteName && nameKey in themeVariables && { [nameKey]: siteName }),
        ...(siteDescription &&
            'summary' in themeVariables && { summary: siteDescription }),
    };
    if (Object.keys(values).length === 0) {
        return;
    }
    await ctx.configTenantCollection.update(current._id, {
        ...current,
        front: {
            ...current.front,
            // the theme settings editor shows the stored variables only
            theme: { ...themeVariables, ...current.front?.theme, ...values },
        },
    });
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
    const uriField = oldField.transformers.find(
        (transformer: any): any =>
            transformer && transformer.operation === 'AUTOGENERATE_URI',
    );
    if (uriField) {
        return ctx.field.create(
            {
                scope,
                display,
                ...newField,
                position: index,
                transformers: [
                    {
                        operation: 'COLUMN',
                        args: [
                            {
                                name: 'column',
                                type: 'column',
                                value: 'uri',
                            },
                        ],
                    },
                ],
            },
            name,
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
    ctx.catalogModels = catalogModels;
    ctx.availableLoaders = config.get('scripts.loaders');
    ctx.downloadModelArchive = downloadModelArchive;
    ctx.applyRecommendedTheme = applyRecommendedTheme;
    ctx.applySiteInfo = applySiteInfo;

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
    // a width or label change must not rebuild the search index nor the facets
    const previousField = await ctx.field.findOneById(id);
    const hasChanged = (key: 'searchable' | 'isFacet') =>
        !previousField ||
        previousField[key] !== (newField as Record<string, unknown>)[key];

    try {
        ctx.body = await ctx.field.updateOneById(id, newField);
        if (hasChanged('searchable')) {
            await indexSearchableFields(ctx);
        }
    } catch (error) {
        ctx.status = 403;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }

    if (hasChanged('isFacet') && (await ctx.publishedDataset.countAll()) > 0) {
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
    const filename = `${ctx.tenant}_model_v${version}_${moment().format('YYYY-MM-DD-HHmmss')}.tar`;
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

        // Outside dataset/: restoreModel wipes every collection it restores
        const { theme, front } =
            (await ctx.configTenantCollection.findLast()) ?? {};
        await pack.entry(
            { name: CONFIG_TENANT_ENTRY },
            JSON.stringify({ theme, front }),
        );

        await pack.finalize();
        ctx.status = 200;
        ctx.body = pack;
    } catch (e) {
        ctx.status = 500;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = e.message;
    }
};

export const importCatalogModel = async (ctx: any) => {
    const { id, siteName, siteDescription, theme } = ctx.request.body ?? {};
    const model = findCatalogModel(ctx.catalogModels, id, ctx.availableLoaders);

    if (!model) {
        ctx.status = 404;
        ctx.body = { error: 'model_not_found' };
        return;
    }

    if (!new URL(model.url).pathname.endsWith('.tar')) {
        ctx.status = 400;
        ctx.body = { error: 'model_archive_not_tar' };
        return;
    }

    let fileStream;
    try {
        fileStream = await ctx.downloadModelArchive(model.url);
    } catch (e) {
        ctx.status = 502;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: e.message };
        return;
    }

    try {
        const restored = (await ctx.restoreFields(fileStream, ctx)) ?? {};
        let themeNotFound = restored.themeNotFound;
        // The theme chosen in the wizard, else the catalog one, overrides the
        // archive's one: its result fully replaces the archive's
        // themeNotFound, which would be misleading
        const themeToApply =
            (typeof theme === 'string' && theme) || model.theme;
        if (themeToApply) {
            const applied = await ctx.applyRecommendedTheme(ctx, themeToApply);
            themeNotFound = applied.themeNotFound;
        }
        // after the theme: applying it resets the theme variables
        try {
            await ctx.applySiteInfo(ctx, { siteName, siteDescription });
        } catch (e) {
            // optional: the model is imported, the admin can still set them
            // in the theme settings
            getLogger(ctx.tenant).error('Site info write error', {
                error: (e as Error).message,
            });
        }

        // the wizard reloads the admin data itself
        ctx.body = { message: 'Model imported successfully', themeNotFound };
        ctx.status = 200;
    } catch (e) {
        ctx.status = 500;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: e.message };
    }
};

export const importFields = (asyncBusboyImpl: any) => async (ctx: any) => {
    const { files } = await asyncBusboyImpl(ctx.req);
    const fileStream = files[0];

    try {
        const { themeNotFound } =
            (await ctx.restoreFields(fileStream, ctx)) ?? {};
        const enrichments = await ctx.enrichment.findAll();
        const precomputed = await ctx.precomputed.findAll();

        ctx.body = {
            message: 'Model imported successfully',
            hasEnrichments: enrichments?.length > 0,
            hasPrecomputed: precomputed?.length > 0,
            themeNotFound,
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

        const workerQueue = getOrCreateWorkerQueue(ctx.tenant, 1);
        await workerQueue.add(
            PUBLISHER, // Name of the job
            { jobType: PUBLISHER, tenant: ctx.tenant },
            { jobId: randomUUID() },
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
    } finally {
        // even after a partial drop: the dropped collections need their indexes back
        invalidateRepositories(ctx.tenant);
    }
};

const app = new Koa();

app.use(setup);

app.use(route.get('/export', exportFields));
app.use(route.post('/import', importFields(asyncBusboy)));
app.use(route.delete('/', dropFieldCollection));
app.use(koaBodyParser());
app.use(route.post('/import-catalog-model', importCatalogModel));
app.use(route.post('/', postField));
app.use(route.post('/duplicate', duplicateField));
app.use(route.put('/reorder', reorderField));
app.use(route.patch('/searchable', patchSearchableFields));
app.use(route.patch('/overview', patchOverview));
app.use(route.patch('/sort-field', patchSortField));
app.use(route.patch('/sort-order', patchSortOrder));
app.use(route.patch('/:id', patchField));
app.use(route.del('/:id', removeField));

export const frontFieldRoutes = new Koa();

frontFieldRoutes.use(route.get('/', getAllField));

export default app;
