import {
    Overview,
    SCOPE_COLLECTION,
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
    SCOPE_GRAPHIC,
} from '@lodex/common';
import _ from 'lodash';
import { MongoClient } from 'mongodb';
import { text } from 'stream/consumers';
import tar from 'tar-stream';
import { default as configTenantFactory } from '../../models/configTenant';
import { default as enrichmentFactory } from '../../models/enrichment';
import { default as fieldFactory, validateField } from '../../models/field';
import { default as precomputedFactory } from '../../models/precomputed';
import { default as publishedDatasetModelFactory } from '../../models/publishedDataset';
import indexSearchableFields from '../../services/indexSearchableFields';
import {
    applyConfigTenant,
    applyRecommendedTheme,
    applySiteInfo,
    exportFields,
    getAllField,
    importCatalogModel,
    importFields,
    patchField,
    patchOverview,
    patchSortField,
    patchSortOrder,
    postField,
    removeField,
    reorderField,
    restoreFields,
    setup,
} from './field';
import publishFacets from './publishFacets';
import config from 'config';
import {
    catalogModels,
    downloadModelArchive,
} from '../../services/catalogModel';

jest.mock('../../services/indexSearchableFields');
jest.mock('../../services/logger', () => {
    const logger = { error: jest.fn(), info: jest.fn(), warn: jest.fn() };
    return () => logger;
});
const mockLogger = jest.requireMock('../../services/logger')();
jest.mock('../../models/themes', () => {
    const themes: Record<string, object> = {
        default: { siteTitle: '', summary: '' },
        istex: {
            color: 'istex-green',
            title: 'exemple : Services',
            summary: 'exemple : summary',
        },
        // an older theme, without the site name and description
        legacy: { color: 'grey' },
    };
    return {
        getTheme: (name: string) =>
            themes[name]
                ? { customTemplateVariables: themes[name] }
                : undefined,
    };
});

const readTarEntries = (stream: any): Promise<Record<string, string>> =>
    new Promise((resolve, reject) => {
        const entries: Record<string, string> = {};
        const extract = tar.extract();
        extract.on('entry', async (header: any, entry: any, next: any) => {
            entries[header.name] = await text(entry);
            next();
        });
        extract.on('finish', () => resolve(entries));
        extract.on('error', reject);
        stream.pipe(extract);
    });

describe('field routes', () => {
    const connectionStringURI = process.env.MONGODB_URI_FOR_TESTS as string;
    let fieldModel: any,
        enrichmentModel: any,
        precomputedModel: any,
        publishedDatasetModel: any;
    let insertedFields: any;
    let db: any;
    let connection: any;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI);
        db = connection.db();
        // @ts-expect-error TS(2339): Property 'mockImplementation' does not exist on ty... Remove this comment to see the full error message
        indexSearchableFields.mockImplementation(() => null);
    });

    afterAll(async () => {
        await db.dropDatabase();
        await connection.close();
        // @ts-expect-error TS(2339): Property 'mockClear' does not exist on type '(ctx:... Remove this comment to see the full error message
        indexSearchableFields.mockClear();
    });

    beforeEach(async () => {
        await Promise.all([
            db.collection('field').deleteMany({}),
            db.collection('enrichment').deleteMany({}),
            db.collection('precomputed').deleteMany({}),
            db.collection('publishedDataset').deleteMany({}),
        ]);

        fieldModel = await fieldFactory(db);
        enrichmentModel = await enrichmentFactory(db);
        precomputedModel = await precomputedFactory(db);
        publishedDatasetModel = await publishedDatasetModelFactory(db);

        insertedFields = await Promise.all([
            fieldModel.create(
                {
                    scope: SCOPE_DATASET,
                    label: 'Dataset Name',
                    searchable: true,
                    transformers: [
                        {
                            operation: 'VALUE',
                            args: [
                                {
                                    name: 'value',
                                    type: 'string',
                                    value: 'Une collection de films célébres',
                                },
                            ],
                        },
                    ],
                    position: 2,
                    scheme: 'http://purl.org/dc/terms/title',
                    language: 'fr',
                    format: {
                        name: 'title',
                    },
                    name: 'WXc1',
                    count: 0,
                    display: true,
                    overview: Overview.RESOURCE_DETAIL_1,
                    isDefaultSortField: true,
                    sortOrder: 'asc',
                },
                '5Hvs',
            ),
            fieldModel.create(
                {
                    scope: SCOPE_DATASET,
                    label: 'A Field',
                    transformers: [
                        {
                            operation: 'AUTOGENERATE_URI',
                            args: [],
                        },
                    ],
                    scheme: 'http://purl.org/dc/terms/identifier',
                    format: {
                        args: {
                            type: 'value',
                            value: '',
                        },
                        name: 'test',
                    },
                    position: 1,
                    name: 'uri',
                },
                'GaV6',
            ),
        ]).then((fields: any) =>
            fields.toSorted((a: any, b: any) => {
                return a.position - b.position;
            }),
        );
    });

    describe('setup', () => {
        it('should add validateField to ctx and call next', async () => {
            const ctx = {};
            const next = jest.fn();

            await setup(ctx, next);

            expect(ctx).toEqual({
                publishFacets,
                validateField,
                restoreFields,
                catalogModels,
                availableLoaders: config.get('scripts.loaders'),
                downloadModelArchive,
                applyRecommendedTheme,
                applySiteInfo,
            });
        });

        it('should also set status and body if next is rejected', async () => {
            const ctx = {};
            const next = jest
                .fn()
                .mockImplementation(() => Promise.reject(new Error('Boom')));

            await setup(ctx, next);

            expect(ctx).toEqual({
                publishFacets,
                validateField,
                body: { error: 'Boom' },
                status: 500,
                restoreFields,
                catalogModels,
                availableLoaders: config.get('scripts.loaders'),
                downloadModelArchive,
                applyRecommendedTheme,
                applySiteInfo,
            });
        });
    });

    describe('getAllField', () => {
        it('should call ctx.field.findAll and pass the result to ctx.body', async () => {
            const ctx = {
                field: fieldModel,
            };

            await getAllField(ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toMatchObject(insertedFields);
        });
    });

    describe('exportFields', () => {
        const ctx = {
            req: 'request',
            set: jest.fn(),
            res: 'result',
            tenant: 'instance-name',
        };

        beforeEach(() => {
            ctx.set.mockClear();
        });

        it('should return good header infromations', async () => {
            await exportFields(ctx);

            expect(ctx.set.mock.calls[0][0]).toBe('Content-disposition');
            expect(
                ctx.set.mock.calls[0][1].startsWith(
                    'attachment; filename=instance-name_model_',
                ) && ctx.set.mock.calls[0][1].endsWith('.tar'),
            ).toBeTruthy();

            expect(ctx.set.mock.calls[1]).toEqual([
                'Content-type',
                'application/x-tar',
            ]);
        });

        it('should return 500 in ctx.status and error message in ctx.body on error', async () => {
            await exportFields(ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(500);
        });

        it('should export only theme and front from the tenant config', async () => {
            await db.collection('configTenant').deleteMany({});
            const configTenantCollection = await configTenantFactory(db);
            await configTenantCollection.create({
                theme: 'istex',
                front: { multilingual: true },
                userAuth: { username: 'user', password: 'secret' },
                enableAutoPublication: true,
                enrichmentBatchSize: 10,
            });
            const exportCtx: any = {
                set: jest.fn(),
                tenant: 'instance-name',
                db,
                configTenantCollection,
            };

            await exportFields(exportCtx);

            const entries = await readTarEntries(exportCtx.body);
            expect(JSON.parse(entries['config/configTenant.json'])).toEqual({
                theme: 'istex',
                front: { multilingual: true },
            });
        });
    });

    describe('importFields', () => {
        const ctx = {
            req: 'request',
            set: jest.fn(),
            restoreFields: jest
                .fn()
                .mockImplementation(() => Promise.resolve('RESTORE OK')),
        };
        beforeEach(() => {
            ctx.restoreFields.mockClear();
            ctx.set.mockClear();

            // @ts-expect-error TS(2339): Property 'enrichment' does not exist on type '{ re... Remove this comment to see the full error message
            ctx.enrichment = enrichmentModel;
            // @ts-expect-error TS(2339): Property 'precomputed' does not exist on type '{ r... Remove this comment to see the full error message
            ctx.precomputed = precomputedModel;
        });

        it('should import fields without enrichments', async () => {
            const asyncBusboyImpl = jest.fn().mockImplementation(() => ({
                files: ['file0'],
            }));

            await importFields(asyncBusboyImpl)(ctx);
            expect(asyncBusboyImpl).toHaveBeenCalledWith('request');
            expect(ctx.restoreFields).toHaveBeenCalledWith('file0', ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(200);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body.hasEnrichments).toBe(false);
        });

        it('should import fields with enrichments', async () => {
            const asyncBusboyImpl = jest.fn().mockImplementation(() => ({
                files: ['file0'],
            }));

            await enrichmentModel.create({});

            await importFields(asyncBusboyImpl)(ctx);
            expect(asyncBusboyImpl).toHaveBeenCalledWith('request');
            expect(ctx.restoreFields).toHaveBeenCalledWith('file0', ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(200);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body.hasEnrichments).toBe(true);
        });

        it('should import fields with precomputed', async () => {
            const asyncBusboyImpl = jest.fn().mockImplementation(() => ({
                files: ['file0'],
            }));

            await precomputedModel.create({
                name: 'A',
                webServiceUrl: 'http://lodex.fr',
                sourceColumns: ['source'],
            });

            await importFields(asyncBusboyImpl)(ctx);
            expect(asyncBusboyImpl).toHaveBeenCalledWith('request');
            expect(ctx.restoreFields).toHaveBeenCalledWith('file0', ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(200);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body.hasPrecomputed).toBe(true);
        });

        it('should import fields with precomputed and enrichment', async () => {
            const asyncBusboyImpl = jest.fn().mockImplementation(() => ({
                files: ['file0'],
            }));

            await Promise.all([
                enrichmentModel.create({}),
                precomputedModel.create({
                    name: 'A',
                    webServiceUrl: 'http://lodex.fr',
                    sourceColumns: ['source'],
                }),
            ]);

            await importFields(asyncBusboyImpl)(ctx);
            expect(asyncBusboyImpl).toHaveBeenCalledWith('request');
            expect(ctx.restoreFields).toHaveBeenCalledWith('file0', ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(200);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body.hasPrecomputed).toBe(true);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body.hasEnrichments).toBe(true);
        });

        it('should return the theme that could not be applied', async () => {
            const asyncBusboyImpl = jest.fn().mockImplementation(() => ({
                files: ['file0'],
            }));
            ctx.restoreFields.mockImplementationOnce(() =>
                Promise.resolve({ themeNotFound: 'unknown' }),
            );

            await importFields(asyncBusboyImpl)(ctx);

            // @ts-expect-error TS(2339): Property 'body' does not exist
            expect(ctx.body.themeNotFound).toBe('unknown');
        });

        it('should return 500 in ctx.status and error message in ctx.body on error', async () => {
            const asyncBusboyImpl = jest.fn().mockImplementation(() => ({
                files: ['file0'],
            }));

            ctx.restoreFields.mockImplementation(() => {
                throw new Error('Error!');
            });

            await importFields(asyncBusboyImpl)(ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(500);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toBe('Error!');
        });
    });

    describe('applyRecommendedTheme', () => {
        let ctx: any;

        beforeEach(async () => {
            await db.collection('configTenant').deleteMany({});
            const configTenantCollection = await configTenantFactory(db);
            await configTenantCollection.create({
                theme: 'default',
                front: { multilingual: true, theme: { color: 'blue' } },
                userAuth: { username: 'user', active: true },
            });
            ctx = { configTenantCollection };
        });

        it('should set the theme and its variables and keep the rest of front', async () => {
            const result = await applyRecommendedTheme(ctx, 'istex');

            expect(result).toEqual({});
            expect(await ctx.configTenantCollection.findLast()).toMatchObject({
                theme: 'istex',
                front: {
                    multilingual: true,
                    theme: { color: 'istex-green' },
                },
                userAuth: { username: 'user', active: true },
            });
        });

        it("should keep the archive's variables when it already uses the theme", async () => {
            // as restored from an archive customizing the istex theme
            const current = await ctx.configTenantCollection.findLast();
            await ctx.configTenantCollection.update(current._id, {
                ...current,
                theme: 'istex',
                front: { ...current.front, theme: { color: 'custom' } },
            });

            const result = await applyRecommendedTheme(ctx, 'istex');

            expect(result).toEqual({});
            expect(await ctx.configTenantCollection.findLast()).toMatchObject({
                theme: 'istex',
                front: { multilingual: true, theme: { color: 'custom' } },
            });
        });

        it('should do nothing without a configuration', async () => {
            await db.collection('configTenant').deleteMany({});

            const result = await applyRecommendedTheme(ctx, 'istex');

            expect(result).toEqual({});
            expect(await ctx.configTenantCollection.findLast()).toBeNull();
        });

        it('should not touch the config and report an unknown theme', async () => {
            const result = await applyRecommendedTheme(ctx, 'unknown');

            expect(result).toEqual({ themeNotFound: 'unknown' });
            expect(await ctx.configTenantCollection.findLast()).toMatchObject({
                theme: 'default',
                front: { multilingual: true, theme: { color: 'blue' } },
            });
        });
    });

    describe('applySiteInfo', () => {
        let ctx: any;

        const createConfig = (theme: string, variables: object) =>
            ctx.configTenantCollection.create({
                theme,
                front: { multilingual: true, theme: variables },
                userAuth: { username: 'user', active: true },
            });

        beforeEach(async () => {
            await db.collection('configTenant').deleteMany({});
            ctx = { configTenantCollection: await configTenantFactory(db) };
        });

        it('should write the name and description into the theme variables', async () => {
            await createConfig('default', { siteTitle: '', color: 'blue' });

            await applySiteInfo(ctx, {
                siteName: 'My site',
                siteDescription: 'About my site',
            });

            expect(await ctx.configTenantCollection.findLast()).toMatchObject({
                theme: 'default',
                front: {
                    multilingual: true,
                    theme: {
                        siteTitle: 'My site',
                        summary: 'About my site',
                        color: 'blue',
                    },
                },
                userAuth: { username: 'user', active: true },
            });
        });

        it('should write the name into title for a theme using that key', async () => {
            await createConfig('istex', { title: 'exemple : Services' });

            await applySiteInfo(ctx, { siteName: 'My site' });

            const { front } = await ctx.configTenantCollection.findLast();
            expect(front.theme.title).toBe('My site');
            expect(front.theme).not.toHaveProperty('siteTitle');
        });

        it('should trim the values and leave the empty ones untouched', async () => {
            await createConfig('default', {
                siteTitle: 'Archive title',
                summary: 'Archive summary',
            });

            await applySiteInfo(ctx, {
                siteName: '  ',
                siteDescription: ' About my site ',
            });

            const { front } = await ctx.configTenantCollection.findLast();
            expect(front.theme).toEqual({
                siteTitle: 'Archive title',
                summary: 'About my site',
            });
        });

        it("should add the values over the theme's defaults when the configuration has no theme variables yet", async () => {
            await ctx.configTenantCollection.create({
                theme: 'default',
                front: { multilingual: true },
            });

            await applySiteInfo(ctx, { siteName: 'My site' });

            const { front } = await ctx.configTenantCollection.findLast();
            // the theme settings editor shows every variable of the theme
            expect(front).toEqual({
                multilingual: true,
                theme: { siteTitle: 'My site', summary: '' },
            });
        });

        it('should skip the values a theme has no variable for', async () => {
            await createConfig('legacy', { color: 'grey' });

            await applySiteInfo(ctx, {
                siteName: 'My site',
                siteDescription: 'About my site',
            });

            const { front } = await ctx.configTenantCollection.findLast();
            expect(front.theme).toEqual({ color: 'grey' });
        });

        it('should skip a theme unknown to the server', async () => {
            await createConfig('unknown', { color: 'blue' });

            await applySiteInfo(ctx, {
                siteName: 'My site',
                siteDescription: 'About my site',
            });

            const { front } = await ctx.configTenantCollection.findLast();
            expect(front.theme).toEqual({ color: 'blue' });
        });

        it('should do nothing without a configuration', async () => {
            await applySiteInfo(ctx, { siteName: 'My site' });

            expect(await ctx.configTenantCollection.findLast()).toBeNull();
        });
    });

    describe('importCatalogModel', () => {
        const tarModel = {
            id: 'm',
            url: 'https://x/m.tar',
            loader: 'csv',
        };
        const stream = { filename: 'm.tar' };
        let ctx: any;

        beforeEach(() => {
            ctx = {
                request: { body: { id: 'm' } },
                catalogModels: [
                    tarModel,
                    { id: 'zip', url: 'https://x/m.zip', loader: 'csv' },
                    { ...tarModel, id: 'themed', theme: 'hal-cnrs' },
                ],
                availableLoaders: ['csv'],
                downloadModelArchive: jest.fn().mockResolvedValue(stream),
                restoreFields: jest.fn().mockResolvedValue({}),
                applyRecommendedTheme: jest.fn().mockResolvedValue({}),
                applySiteInfo: jest.fn().mockResolvedValue(undefined),
                enrichment: enrichmentModel,
                precomputed: precomputedModel,
            };
        });

        it('should return 404 for an unknown model', async () => {
            ctx.request.body = { id: 'nope' };

            await importCatalogModel(ctx);

            expect(ctx.status).toBe(404);
            expect(ctx.body).toEqual({ error: 'model_not_found' });
            expect(ctx.downloadModelArchive).not.toHaveBeenCalled();
        });

        it('should return 400 when the archive is not a tar', async () => {
            ctx.request.body = { id: 'zip' };

            await importCatalogModel(ctx);

            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({ error: 'model_archive_not_tar' });
            expect(ctx.downloadModelArchive).not.toHaveBeenCalled();
        });

        it('should restore the downloaded archive without applying a theme', async () => {
            await importCatalogModel(ctx);

            expect(ctx.downloadModelArchive).toHaveBeenCalledWith(
                'https://x/m.tar',
            );
            expect(ctx.restoreFields).toHaveBeenCalledWith(stream, ctx);
            expect(ctx.applyRecommendedTheme).not.toHaveBeenCalled();
            expect(ctx.status).toBe(200);
            expect(ctx.body).toEqual({
                message: 'Model imported successfully',
                themeNotFound: undefined,
            });
        });

        it('should apply the recommended theme after restoring', async () => {
            ctx.request.body = { id: 'themed' };
            ctx.applyRecommendedTheme.mockResolvedValue({
                themeNotFound: 'hal-cnrs',
            });

            await importCatalogModel(ctx);

            expect(ctx.applyRecommendedTheme).toHaveBeenCalledWith(
                ctx,
                'hal-cnrs',
            );
            expect(ctx.restoreFields.mock.invocationCallOrder[0]).toBeLessThan(
                ctx.applyRecommendedTheme.mock.invocationCallOrder[0],
            );
            expect(ctx.status).toBe(200);
            expect(ctx.body.themeNotFound).toBe('hal-cnrs');
        });

        it('should apply the site name and description after the recommended theme', async () => {
            ctx.request.body = {
                id: 'themed',
                siteName: 'My site',
                siteDescription: 'About my site',
            };

            await importCatalogModel(ctx);

            expect(ctx.applySiteInfo).toHaveBeenCalledWith(ctx, {
                siteName: 'My site',
                siteDescription: 'About my site',
            });
            expect(
                ctx.applyRecommendedTheme.mock.invocationCallOrder[0],
            ).toBeLessThan(ctx.applySiteInfo.mock.invocationCallOrder[0]);
            expect(ctx.status).toBe(200);
        });

        it('should apply the site name and description after restoring a model without theme', async () => {
            ctx.request.body = { id: 'm', siteName: 'My site' };

            await importCatalogModel(ctx);

            expect(ctx.applySiteInfo).toHaveBeenCalledWith(ctx, {
                siteName: 'My site',
                siteDescription: undefined,
            });
            expect(ctx.restoreFields.mock.invocationCallOrder[0]).toBeLessThan(
                ctx.applySiteInfo.mock.invocationCallOrder[0],
            );
        });

        it('should log a failed site info write and still import the model', async () => {
            ctx.request.body = { id: 'm', siteName: 'My site' };
            ctx.applySiteInfo.mockRejectedValue(new Error('write failed'));

            await importCatalogModel(ctx);

            expect(mockLogger.error).toHaveBeenCalledWith(
                'Site info write error',
                expect.objectContaining({ error: 'write failed' }),
            );
            expect(ctx.status).toBe(200);
            expect(ctx.body).toEqual({
                message: 'Model imported successfully',
                themeNotFound: undefined,
            });
        });

        it('should return the theme of the archive that could not be applied', async () => {
            ctx.restoreFields.mockResolvedValue({ themeNotFound: 'x' });

            await importCatalogModel(ctx);

            expect(ctx.body.themeNotFound).toBe('x');
        });

        it('should let the catalog theme result replace the archive themeNotFound', async () => {
            ctx.request.body = { id: 'themed' };
            ctx.restoreFields.mockResolvedValue({ themeNotFound: 'x' });
            ctx.applyRecommendedTheme.mockResolvedValue({});

            await importCatalogModel(ctx);

            expect(ctx.body.themeNotFound).toBeUndefined();
        });

        it('should apply the chosen theme instead of the recommended one', async () => {
            ctx.request.body = { id: 'themed', theme: 'nougat' };

            await importCatalogModel(ctx);

            expect(ctx.applyRecommendedTheme).toHaveBeenCalledTimes(1);
            expect(ctx.applyRecommendedTheme).toHaveBeenCalledWith(
                ctx,
                'nougat',
            );
            expect(ctx.status).toBe(200);
        });

        it('should apply the chosen theme over the archive one for a model without theme', async () => {
            ctx.request.body = { id: 'm', theme: 'default' };
            ctx.restoreFields.mockResolvedValue({ themeNotFound: 'x' });

            await importCatalogModel(ctx);

            expect(ctx.applyRecommendedTheme).toHaveBeenCalledWith(
                ctx,
                'default',
            );
            expect(ctx.body.themeNotFound).toBeUndefined();
        });

        it('should ignore a chosen theme that is not a theme name', async () => {
            ctx.request.body = { id: 'themed', theme: { $ne: null } };

            await importCatalogModel(ctx);

            expect(ctx.applyRecommendedTheme).toHaveBeenCalledWith(
                ctx,
                'hal-cnrs',
            );
        });

        it('should apply the site name and description after the chosen theme', async () => {
            ctx.request.body = { id: 'm', theme: 'nougat', siteName: 'S' };

            await importCatalogModel(ctx);

            expect(
                ctx.applyRecommendedTheme.mock.invocationCallOrder[0],
            ).toBeLessThan(ctx.applySiteInfo.mock.invocationCallOrder[0]);
        });

        it('should return 502 when the download fails', async () => {
            ctx.downloadModelArchive.mockRejectedValue(
                new Error('404 Not Found'),
            );

            await importCatalogModel(ctx);

            expect(ctx.status).toBe(502);
            expect(ctx.body).toEqual({ error: '404 Not Found' });
            expect(ctx.restoreFields).not.toHaveBeenCalled();
        });
    });

    describe('applyConfigTenant', () => {
        let ctx: any;

        beforeEach(async () => {
            await db.collection('configTenant').deleteMany({});
            const configTenantCollection = await configTenantFactory(db);
            await configTenantCollection.create({
                theme: 'default',
                front: { multilingual: false, theme: { color: 'blue' } },
                userAuth: { username: 'user', active: true },
            });
            ctx = { configTenantCollection };
        });

        it('should replace theme and front and keep the other settings', async () => {
            const result = await applyConfigTenant(ctx, {
                theme: 'istex',
                front: { multilingual: true },
            });

            expect(result).toEqual({});
            expect(await ctx.configTenantCollection.findLast()).toMatchObject({
                theme: 'istex',
                front: { multilingual: true },
                userAuth: { username: 'user', active: true },
            });
        });

        it('should keep the current theme and report it when the theme is unknown', async () => {
            const result = await applyConfigTenant(ctx, {
                theme: 'unknown',
                front: { multilingual: true, theme: { color: 'red' } },
            });

            expect(result).toEqual({ themeNotFound: 'unknown' });
            const { theme, front } =
                await ctx.configTenantCollection.findLast();
            expect(theme).toBe('default');
            // front.theme holds the theme's template variables: keep the current ones
            expect(front).toEqual({
                multilingual: true,
                theme: { color: 'blue' },
            });
        });

        it('should leave the config untouched when the archive has none', async () => {
            const result = await applyConfigTenant(ctx, undefined);

            expect(result).toEqual({});
            expect(await ctx.configTenantCollection.findLast()).toMatchObject({
                theme: 'default',
                front: { multilingual: false, theme: { color: 'blue' } },
            });
        });
    });

    describe('postField', () => {
        it('should insert the new field', async () => {
            const fieldData = {
                scope: 'dataset',
                label: 'Dataset Description',
                searchable: true,
                transformers: [
                    {
                        operation: 'VALUE',
                        args: [
                            {
                                name: 'value',
                                type: 'string',
                                value: "Cette collection n'a pas d'autre but que de présenter un manière d’utiliser l'application Lodex pour mettre en ligne des données.",
                            },
                        ],
                    },
                ],
                position: 2,
                scheme: 'http://purl.org/dc/terms/description',
                language: 'fr',
                format: {
                    args: {
                        paragraphWidth: '80%',
                    },
                    name: 'None',
                },
                count: 0,
                display: true,
                overview: 200,
            };
            const ctx = {
                request: {
                    body: fieldData,
                },
                field: fieldModel,
            };

            await postField(ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toMatchObject(fieldData);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toHaveProperty('_id');
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(await fieldModel.findOneById(ctx.body._id)).toMatchObject(
                fieldData,
            );
        });

        it.each([
            { formatName: 'network' as const },
            { formatName: 'network3D' as const },
        ])(
            'should transform $formatName format with advanced color mode',
            async ({ formatName }) => {
                const fieldData = {
                    scope: 'dataset',
                    label: 'Network Field',
                    position: 0,
                    format: {
                        name: formatName,
                        args: {
                            isAdvancedColorMode: true,
                            captionTitle: 'Legend',
                            colorScale: [
                                {
                                    color: '#FF0000',
                                    caption: 'Red Items',
                                    values: ['A', 'B'],
                                },
                                {
                                    color: undefined,
                                    caption: 'Default',
                                    values: ['C'],
                                },
                            ],
                        },
                    },
                };

                const ctx: any = {
                    request: {
                        body: fieldData,
                    },
                    field: fieldModel,
                };

                await postField(ctx);

                expect(ctx.body).toMatchObject({
                    scope: 'dataset',
                    label: 'Network Field',
                    format: {
                        name: formatName,
                        args: {
                            isAdvancedColorMode: true,
                            captionTitle: 'Legend',
                            colorScale: [
                                {
                                    color: '#FF0000',
                                    caption: 'Red Items',
                                    values: ['A', 'B'],
                                },
                                {
                                    color: '#000000',
                                    caption: 'Default',
                                    values: ['C'],
                                },
                            ],
                        },
                    },
                });

                expect(ctx.body).toHaveProperty('_id');
            },
        );

        it.each([
            { formatName: 'network' as const },
            { formatName: 'network3D' as const },
        ])(
            'should filter out items without values in $formatName format',
            async ({ formatName }) => {
                const fieldData = {
                    scope: 'dataset',
                    label: 'Network Field',
                    position: 0,
                    format: {
                        name: formatName,
                        args: {
                            isAdvancedColorMode: true,
                            captionTitle: 'Legend',
                            colorScale: [
                                {
                                    color: '#FF0000',
                                    caption: 'Red Items',
                                    values: 'A\nB',
                                },
                                {
                                    color: '#00FF00',
                                    caption: 'No values',
                                    values: undefined,
                                },
                                {
                                    color: '#0000FF',
                                    caption: 'Empty values',
                                    values: '',
                                },
                                {
                                    color: '#000000',
                                    caption: 'Valid',
                                    values: 'C',
                                },
                                undefined,
                            ],
                        },
                    },
                };

                const ctx: any = {
                    request: {
                        body: fieldData,
                    },
                    field: fieldModel,
                };

                await postField(ctx);

                // Should only keep items with valid values
                expect(ctx.body.format.args.colorScale).toEqual([
                    {
                        color: '#FF0000',
                        caption: 'Red Items',
                        values: ['A', 'B'],
                    },
                    {
                        color: '#000000',
                        caption: 'Valid',
                        values: ['C'],
                    },
                ]);
            },
        );
    });

    describe('patchField', () => {
        const label = 'new label';
        const ctx = {
            request: {
                body: {
                    label,
                },
            },
            publishFacets: jest.fn(),
        };

        beforeEach(() => {
            ctx.publishFacets.mockClear();
            // @ts-expect-error TS(2339): Property 'field' does not exist on type '{ request... Remove this comment to see the full error message
            ctx.field = fieldModel;
            // @ts-expect-error TS(2339): Property 'publishedDataset' does not exist on type... Remove this comment to see the full error message
            ctx.publishedDataset = publishedDatasetModel;
        });

        it('should validateField and then update field', async () => {
            await patchField(ctx, insertedFields[0]._id);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toStrictEqual({
                ...insertedFields[0],
                label,
            });
        });

        it('update the published facets when the field becomes a facet', async () => {
            await publishedDatasetModel.create({});
            const facetCtx = {
                ...ctx,
                request: { body: { label, isFacet: true } },
            };
            await patchField(facetCtx, insertedFields[0]._id);
            expect(ctx.publishFacets).toHaveBeenCalledWith(
                facetCtx,
                expect.objectContaining([
                    {
                        ...insertedFields[0],
                        label,
                        isFacet: true,
                    },
                ]),
                false,
            );
        });

        it('should not update the published facets when isFacet does not change', async () => {
            await publishedDatasetModel.create({});
            await patchField(ctx, insertedFields[0]._id);
            expect(ctx.publishFacets).toHaveBeenCalledTimes(0);
        });

        it('should not update the published facets if dataset is not published (publishedDataset = 0)', async () => {
            await patchField(ctx, insertedFields[0]._id);
            expect(ctx.publishFacets).toHaveBeenCalledTimes(0);
        });

        it.each(['network', 'network3D'])(
            'should transform field for %s format',
            async (formatName) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ctx: any = {
                    request: {
                        body: {
                            label: 'network field',
                            format: {
                                name: formatName,
                                args: {
                                    isAdvancedColorMode: true,
                                    colorScale: [
                                        { values: ['val1'] },
                                        {
                                            values: ['val2'],
                                            caption: 'Caption 2',
                                        },
                                    ],
                                    captionTitle: 'My Caption Title',
                                },
                            },
                        },
                    },
                    publishFacets: jest.fn(),
                    field: fieldModel,
                    publishedDataset: publishedDatasetModel,
                };

                await patchField(ctx, insertedFields[0]._id);

                expect(ctx.body.format.args.colorScale).toEqual([
                    {
                        values: ['val1'],
                        color: '#000000',
                        caption: null,
                    },
                    {
                        values: ['val2'],
                        color: '#000000',
                        caption: 'Caption 2',
                    },
                ]);
                expect(ctx.body.format.args.captionTitle).toBe(
                    'My Caption Title',
                );
            },
        );

        it.each(['network', 'network3D'])(
            'should filter out items without values in %s format',
            async (formatName) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ctx: any = {
                    request: {
                        body: {
                            name: 'network field',
                            format: {
                                name: formatName,
                                args: {
                                    isAdvancedColorMode: true,
                                    colorScale: [
                                        {
                                            values: 'val1',
                                            color: '#FF0000',
                                            caption: 'Valid 1',
                                        },
                                        {
                                            values: undefined,
                                            color: '#00FF00',
                                            caption: 'No values',
                                        },
                                        {
                                            values: '',
                                            color: '#0000FF',
                                            caption: 'Empty values',
                                        },
                                        { values: 'val2', caption: 'Valid 2' },
                                        undefined,
                                    ],
                                    captionTitle: 'My Caption Title',
                                },
                            },
                        },
                    },
                    publishFacets: jest.fn(),
                    field: fieldModel,
                    publishedDataset: publishedDatasetModel,
                };

                await patchField(ctx, insertedFields[0]._id);

                // Should only keep items with valid values
                expect(ctx.body.format.args.colorScale).toEqual([
                    {
                        values: ['val1'],
                        color: '#FF0000',
                        caption: 'Valid 1',
                    },
                    {
                        values: ['val2'],
                        color: '#000000',
                        caption: 'Valid 2',
                    },
                ]);
            },
        );
    });

    describe('patchOverview', () => {
        it('should remove overview from other field with same overview', async () => {
            const ctx = {
                request: {
                    body: {
                        _id: insertedFields[0]._id.toString(),
                        overview: Overview.RESOURCE_DETAIL_1,
                    },
                },
                field: fieldModel,
            };
            await patchOverview(ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toStrictEqual({
                ...insertedFields[0],
                overview: Overview.RESOURCE_DETAIL_1,
            });

            await expect(
                fieldModel.findOneById(insertedFields[0]._id),
            ).resolves.toStrictEqual({
                ...insertedFields[0],
                overview: Overview.RESOURCE_DETAIL_1,
            });

            await expect(
                fieldModel.findOneById(insertedFields[1]._id),
            ).resolves.toStrictEqual(
                _.omit(
                    insertedFields[1],
                    'overview',
                    'isDefaultSortField',
                    'sortOrder',
                ),
            );
        });

        it('should remove overview from other field with same overview and same subresourceId if subresourceId is set', async () => {
            await fieldModel.updateMany(
                {},
                { $set: { subresourceId: 'subresourceId' } },
            );

            const ctx = {
                request: {
                    body: {
                        _id: insertedFields[0]._id.toString(),
                        overview: Overview.RESOURCE_DETAIL_1,
                        subresourceId: 'subresourceId',
                    },
                },
                field: fieldModel,
            };
            await patchOverview(ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toStrictEqual({
                ...insertedFields[0],
                overview: Overview.RESOURCE_DETAIL_1,
                subresourceId: 'subresourceId',
            });

            await expect(
                fieldModel.findOneById(insertedFields[0]._id),
            ).resolves.toStrictEqual({
                ...insertedFields[0],
                overview: Overview.RESOURCE_DETAIL_1,
                subresourceId: 'subresourceId',
            });

            await expect(
                fieldModel.findOneById(insertedFields[1]._id),
            ).resolves.toStrictEqual({
                ..._.omit(
                    insertedFields[1],
                    'overview',
                    'isDefaultSortField',
                    'sortOrder',
                ),
                subresourceId: 'subresourceId',
            });
        });

        it('should update field overview if id is set', async () => {
            const ctx = {
                request: {
                    body: {
                        _id: insertedFields[0]._id.toString(),
                        overview: 200,
                    },
                },
                field: fieldModel,
            };

            await patchOverview(ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toMatchObject({
                ...insertedFields[0],
                overview: 200,
            });

            await expect(
                fieldModel.findOneById(insertedFields[0]._id),
            ).resolves.toMatchObject({
                ...insertedFields[0],
                overview: 200,
            });

            await expect(
                fieldModel.findOneById(insertedFields[1]._id),
            ).resolves.toMatchObject(insertedFields[1]);
        });

        it('should not update field overview if id is null', async () => {
            const ctx = {
                request: {
                    body: {
                        _id: null,
                        overview: Overview.RESOURCE_DETAIL_1,
                    },
                },
                field: fieldModel,
            };
            await patchOverview(ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toStrictEqual({ status: 'success' });

            await expect(
                fieldModel.findOneById(insertedFields[0]._id),
            ).resolves.toStrictEqual(insertedFields[0]);

            await expect(
                fieldModel.findOneById(insertedFields[1]._id),
            ).resolves.toStrictEqual(
                _.omit(
                    insertedFields[1],
                    'overview',
                    'isDefaultSortField',
                    'sortOrder',
                ),
            );
        });

        it('should reset default sort if field is no longer sortable', async () => {
            const ctx = {
                request: {
                    body: {
                        _id: insertedFields[1]._id.toString(),
                        overview: 200,
                    },
                },
                field: fieldModel,
            };
            await patchOverview(ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toStrictEqual({
                ..._.omit(insertedFields[1], 'isDefaultSortField', 'sortOrder'),
                overview: 200,
            });

            await expect(
                fieldModel.findOneById(insertedFields[0]._id),
            ).resolves.toStrictEqual(insertedFields[0]);

            await expect(
                fieldModel.findOneById(insertedFields[1]._id),
            ).resolves.toStrictEqual({
                ..._.omit(insertedFields[1], 'isDefaultSortField', 'sortOrder'),
                overview: 200,
            });
        });
    });

    describe('patchSortField', () => {
        it('should update the sort field', async () => {
            const ctx = {
                request: {
                    body: {
                        _id: insertedFields[0]._id.toString(),
                        sortOrder: 'desc',
                    },
                },
                field: fieldModel,
            };

            await patchSortField(ctx);

            await expect(
                fieldModel.findOneById(insertedFields[0]._id),
            ).resolves.toStrictEqual({
                ...insertedFields[0],
                isDefaultSortField: true,
                sortOrder: 'desc',
            });

            await expect(
                fieldModel.findOneById(insertedFields[1]._id),
            ).resolves.toStrictEqual(
                _.omit(insertedFields[1], 'isDefaultSortField', 'sortOrder'),
            );
        });

        it('should reset sort field if no id is provided', async () => {
            const ctx = {
                request: {
                    body: {
                        _id: null,
                        sortOrder: 'desc',
                    },
                },
                field: fieldModel,
            };

            await patchSortField(ctx);

            await expect(
                fieldModel.findOneById(insertedFields[0]._id),
            ).resolves.toStrictEqual(insertedFields[0]);

            await expect(
                fieldModel.findOneById(insertedFields[1]._id),
            ).resolves.toStrictEqual(
                _.omit(insertedFields[1], 'isDefaultSortField', 'sortOrder'),
            );
        });
    });

    describe('patchSortOrder', () => {
        it('should update field sortOrder', async () => {
            const ctx = {
                request: {
                    body: {
                        sortOrder: 'desc',
                    },
                },
                field: fieldModel,
            };

            await patchSortOrder(ctx);

            await expect(
                fieldModel.findOneById(insertedFields[0]._id),
            ).resolves.toStrictEqual(insertedFields[0]);

            await expect(
                fieldModel.findOneById(insertedFields[1]._id),
            ).resolves.toStrictEqual({
                ...insertedFields[1],
                sortOrder: 'desc',
            });
        });
    });

    describe('removeField', () => {
        it('should validateField and then update field', async () => {
            const ctx = {
                request: { body: {} },
                field: fieldModel,
            };

            await removeField(ctx, insertedFields[0]._id);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toStrictEqual({
                acknowledged: true,
                deletedCount: 1,
            });

            await expect(
                fieldModel.findOneById(insertedFields[0]._id),
            ).resolves.toBeNull();

            await expect(
                fieldModel.findOneById(insertedFields[1]._id),
            ).resolves.toMatchObject(insertedFields[1]);
        });
    });

    describe('reorderField', () => {
        beforeEach(() => {
            jest.spyOn(fieldModel, 'updatePosition');
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should update field position based on index in array when all scope are dataset', async () => {
            const ctx = {
                request: {
                    body: {
                        fields: [
                            insertedFields[1].name,
                            insertedFields[0].name,
                        ],
                    },
                },
                field: fieldModel,
            };

            await reorderField(ctx);

            await expect(
                fieldModel.findOneById(insertedFields[0]._id),
            ).resolves.toMatchObject({
                ...insertedFields[0],
                position: 2,
            });

            await expect(
                fieldModel.findOneById(insertedFields[1]._id),
            ).resolves.toMatchObject({
                ...insertedFields[1],
                position: 1,
            });

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toMatchObject([
                {
                    ...insertedFields[1],
                    position: 1,
                },
                {
                    ...insertedFields[0],
                    position: 2,
                },
            ]);
        });

        it('should update field position based on index in array when all scope are collection or document and first one is uri', async () => {
            await fieldModel.updateMany(
                {},
                { $set: { scope: SCOPE_COLLECTION } },
            );

            const field3 = await fieldModel.create(
                {
                    scope: SCOPE_DOCUMENT,
                    label: 'Hello World',
                    transformers: [
                        {
                            operation: 'AUTOGENERATE_URI',
                            args: [],
                        },
                    ],
                    scheme: 'http://purl.org/dc/terms/identifier',
                    format: {
                        args: {
                            type: 'value',
                            value: '',
                        },
                        name: 'hello',
                    },
                    position: 1,
                    name: 'uri',
                },
                '5Kab',
            );

            const ctx = {
                request: {
                    body: {
                        fields: [
                            insertedFields[1].name,
                            field3.name,
                            insertedFields[0].name,
                        ],
                    },
                },
                field: fieldModel,
            };

            await reorderField(ctx);

            expect(
                // @ts-expect-error TS(2339): Property 'body' does not exist on type '{ request:... Remove this comment to see the full error message
                ctx.body.toSorted((a: any, b: any) => a.position - b.position),
            ).toMatchObject([
                {
                    ...insertedFields[1],
                    position: 1,
                    scope: SCOPE_COLLECTION,
                },
                {
                    ...field3,
                    position: 2,
                },
                {
                    ...insertedFields[0],
                    position: 3,
                    scope: SCOPE_COLLECTION,
                },
            ]);
        });

        it('should throw an error if dataset is mixed with other scope', async () => {
            const fields = await Promise.all([
                fieldModel.create(
                    {
                        scope: SCOPE_DOCUMENT,
                        label: 'Hello World',
                        transformers: [
                            {
                                operation: 'AUTOGENERATE_URI',
                                args: [],
                            },
                        ],
                        scheme: 'http://purl.org/dc/terms/identifier',
                        format: {
                            args: {
                                type: 'value',
                                value: '',
                            },
                            name: 'hello',
                        },
                        position: 1,
                        name: 'uri',
                    },
                    '5Kab',
                ),
                fieldModel.create(
                    {
                        scope: SCOPE_COLLECTION,
                        label: 'Hello World',
                        transformers: [
                            {
                                operation: 'AUTOGENERATE_URI',
                                args: [],
                            },
                        ],
                        scheme: 'http://purl.org/dc/terms/identifier',
                        format: {
                            args: {
                                type: 'value',
                                value: '',
                            },
                            name: 'hello',
                        },
                        position: 1,
                        name: 'uri',
                    },
                    'la9n',
                ),
            ]);

            const ctx = {
                request: {
                    body: {
                        fields: [
                            insertedFields[0].name,
                            fields[0].name,
                            fields[1].name,
                        ],
                    },
                },
                field: fieldModel,
            };

            await reorderField(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(400);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body.error).toBe(
                'Bad scope: trying to mix home fields with other fields',
            );

            expect(fieldModel.updatePosition).not.toHaveBeenCalled();
        });

        it('should throw an error if graphic is mixed with other scope', async () => {
            const fields = await Promise.all([
                fieldModel.create(
                    {
                        scope: SCOPE_DOCUMENT,
                        label: 'Hello World',
                        transformers: [
                            {
                                operation: 'AUTOGENERATE_URI',
                                args: [],
                            },
                        ],
                        scheme: 'http://purl.org/dc/terms/identifier',
                        format: {
                            args: {
                                type: 'value',
                                value: '',
                            },
                            name: 'hello',
                        },
                        position: 1,
                        name: 'uri',
                    },
                    '5Kab',
                ),
                fieldModel.create(
                    {
                        scope: SCOPE_GRAPHIC,
                        label: 'Hello World',
                        transformers: [
                            {
                                operation: 'AUTOGENERATE_URI',
                                args: [],
                            },
                        ],
                        scheme: 'http://purl.org/dc/terms/identifier',
                        format: {
                            args: {
                                type: 'value',
                                value: '',
                            },
                            name: 'hello',
                        },
                        position: 1,
                        name: 'uri',
                    },
                    'la9n',
                ),
            ]);

            const ctx = {
                request: {
                    body: {
                        fields: [
                            fields[1].name,
                            insertedFields[0].name,
                            fields[0].name,
                        ],
                    },
                },
                field: fieldModel,
            };

            await reorderField(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(400);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body.error).toBe(
                'Bad scope: trying to mix graphic fields with other fields',
            );

            expect(ctx.field.updatePosition).not.toHaveBeenCalled();
        });
    });
});
