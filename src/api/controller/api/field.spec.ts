import { MongoClient } from 'mongodb';
import { default as enrichmentFactory } from '../../models/enrichment';
import { default as fieldFactory, validateField } from '../../models/field';
import { default as precomputedFactory } from '../../models/precomputed';
import { default as publishedDatasetModelFactory } from '../../models/publishedDataset';
import indexSearchableFields from '../../services/indexSearchableFields';
import publishFacets from './publishFacets';

import {
    exportFields,
    getAllField,
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

import _ from 'lodash';
import { RESOURCE_DETAIL_1 } from '../../../common/overview';
import {
    SCOPE_COLLECTION,
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
    SCOPE_GRAPHIC,
} from '../../../common/scope';

jest.mock('../../services/indexSearchableFields');

describe('field routes', () => {
    const connectionStringURI = process.env.MONGO_URL;
    let fieldModel: any,
        enrichmentModel: any,
        precomputedModel: any,
        publishedDatasetModel: any;
    let insertedFields: any;
    let db: any;
    let connection: any;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI!);
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
                    overview: RESOURCE_DETAIL_1,
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
        };

        beforeEach(() => {
            ctx.set.mockClear();
        });

        it('should return good header infromations', async () => {
            await exportFields(ctx);

            expect(ctx.set.mock.calls[0][0]).toBe('Content-disposition');
            expect(
                ctx.set.mock.calls[0][1].startsWith(
                    'attachment; filename=model_',
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

        it('update the published facets', async () => {
            await publishedDatasetModel.create({});
            await patchField(ctx, insertedFields[0]._id);
            expect(ctx.publishFacets).toHaveBeenCalledWith(
                ctx,
                expect.objectContaining([
                    {
                        ...insertedFields[0],
                        label,
                    },
                ]),
                false,
            );
        });

        it('should not update the published facets if dataset is not published (publishedDataset = 0)', async () => {
            await patchField(ctx, insertedFields[0]._id);
            expect(ctx.publishFacets).toHaveBeenCalledTimes(0);
        });
    });

    describe('patchOverview', () => {
        it('should remove overview from other field with same overview', async () => {
            const ctx = {
                request: {
                    body: {
                        _id: insertedFields[0]._id.toString(),
                        overview: RESOURCE_DETAIL_1,
                    },
                },
                field: fieldModel,
            };
            await patchOverview(ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toStrictEqual({
                ...insertedFields[0],
                overview: RESOURCE_DETAIL_1,
            });

            await expect(
                fieldModel.findOneById(insertedFields[0]._id),
            ).resolves.toStrictEqual({
                ...insertedFields[0],
                overview: RESOURCE_DETAIL_1,
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
                        overview: RESOURCE_DETAIL_1,
                        subresourceId: 'subresourceId',
                    },
                },
                field: fieldModel,
            };
            await patchOverview(ctx);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toStrictEqual({
                ...insertedFields[0],
                overview: RESOURCE_DETAIL_1,
                subresourceId: 'subresourceId',
            });

            await expect(
                fieldModel.findOneById(insertedFields[0]._id),
            ).resolves.toStrictEqual({
                ...insertedFields[0],
                overview: RESOURCE_DETAIL_1,
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
                        overview: RESOURCE_DETAIL_1,
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
