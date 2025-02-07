import { MongoClient } from 'mongodb';
import createAnnotationModel from '../../models/annotation';
import createFieldModel from '../../models/field';
import createPublishedDatasetModel from '../../models/publishedDataset';
import {
    createAnnotation,
    getAnnotation,
    getAnnotations,
    updateAnnotation,
} from './annotation';

const ANNOTATIONS = [
    {
        resourceUri: 'uid:/65257776-4e3c-44f6-8652-85502a97e5ac',
        itemPath: [],
        fieldId: 'GvaF',
        authorName: 'Developer',
        authorEmail: 'developer@marmelab.com',
        comment: 'This is a comment',
        status: 'ongoing',
        internalComment: null,
        administrator: 'Sandrine',
        createdAt: new Date('03-01-2025'),
        updatedAt: new Date('03-01-2025'),
    },
    {
        resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
        itemPath: [],
        fieldId: null,
        authorName: 'John DOE',
        authorEmail: 'john.doe@marmelab.com',
        comment: 'This is another comment',
        status: 'to_review',
        internalComment: 'I asked for further details',
        createdAt: new Date('02-01-2025'),
        updatedAt: new Date('02-01-2025'),
    },
    {
        resourceUri: 'uid:/d4f1e376-d5dd-4853-b515-b7f63b34d67d',
        itemPath: [],
        fieldId: null,
        authorName: 'Jane SMITH',
        authorEmail: 'jane.smith@marmelab.com',
        comment: 'The author list is incomplete: it should include Jane SMITH',
        status: 'rejected',
        internalComment: null,
        createdAt: new Date('01-01-2025'),
        updatedAt: new Date('01-01-2025'),
    },
    {
        resourceUri: 'uid:/783f398d-0675-48d6-b851-137302820cf6',
        itemPath: [],
        fieldId: null,
        authorName: 'Jane SMITH',
        authorEmail: 'jane.smith@marmelab.com',
        comment: 'You shall not pass!',
        status: 'to_review',
        internalComment: null,
        createdAt: new Date('04-01-2025'),
        updatedAt: new Date('04-01-2025'),
    },
];

describe('annotation', () => {
    const connectionStringURI = process.env.MONGO_URL;
    let annotationModel;
    let publishedDatasetModel;
    let fieldModel;
    let connection;
    let db;
    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = connection.db();
        annotationModel = await createAnnotationModel(db);
        fieldModel = await createFieldModel(db);
        publishedDatasetModel = await createPublishedDatasetModel(db);
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => db.dropDatabase());

    describe('createAnnotation', () => {
        it('should create an annotation', async () => {
            const annotation = {
                resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                itemPath: [],
                fieldId: 'Gb4a',
                kind: 'comment',
                comment: 'Hello world',
                authorName: 'John DOE',
            };

            const ctx = {
                request: {
                    body: annotation,
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await createAnnotation(ctx);

            expect(ctx.response.status).toBe(200);
            expect(ctx.body).toMatchObject({
                total: 1,
                data: {
                    ...annotation,
                    status: 'to_review',
                    internalComment: null,
                    authorEmail: null,
                },
            });

            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([
                ctx.body.data,
            ]);
        });

        it('should return an error if annotation is not valid', async () => {
            const annotation = {
                resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                comment: '',
            };

            const ctx = {
                request: {
                    body: annotation,
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await createAnnotation(ctx);

            expect(ctx.response.status).toBe(400);
            expect(ctx.body).toMatchObject({
                total: 0,
                errors: [
                    {
                        path: ['comment'],
                        message: 'error_required',
                    },
                    {
                        path: ['authorName'],
                        message: 'error_required',
                    },
                ],
            });
            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([]);
        });
    });

    describe('getAnnotations', () => {
        let annotationList;
        let field1;
        let field2;
        let field3;

        beforeEach(async () => {
            await fieldModel.create(
                {
                    overview: 1,
                    position: 0,
                },
                'tItl3',
            );

            field1 = await fieldModel.create(
                {
                    position: 1,
                    label: 'field 1',
                    internalName: 'field_1',
                    internalScopes: ['chart'],
                },
                'field1',
            );

            field2 = await fieldModel.create(
                {
                    position: 2,
                    label: 'field 2',
                    internalName: 'field_2',
                    internalScopes: ['document'],
                },
                'field2',
            );

            field3 = await fieldModel.create(
                {
                    position: 3,
                    label: 'field 3',
                    internalName: 'field_3',
                    internalScopes: ['home'],
                    subresourceId: '2dee944d-efb0-4b0f-be12-7f5938db7f8a',
                    overview: 5,
                },
                'hzBla',
            );

            annotationList = await Promise.all([
                annotationModel.create({
                    ...ANNOTATIONS[0],
                    fieldId: field1._id.toString(),
                }),
                annotationModel.create(ANNOTATIONS[1]),
                annotationModel.create({
                    ...ANNOTATIONS[2],
                    fieldId: field2._id.toString(),
                }),
                annotationModel.create({
                    ...ANNOTATIONS[3],
                    fieldId: field3._id.toString(),
                }),
            ]);

            await publishedDatasetModel.insertBatch([
                {
                    uri: ANNOTATIONS[0].resourceUri,
                    versions: [
                        {
                            tItl3: 'Developer resource',
                        },
                    ],
                },
                {
                    uri: ANNOTATIONS[3].resourceUri,
                    versions: [
                        {
                            hzBla: 'A subresource',
                        },
                    ],
                    subresourceId: '2dee944d-efb0-4b0f-be12-7f5938db7f8a',
                },
                {
                    uri: ANNOTATIONS[2].resourceUri,
                    versions: [
                        {
                            tItl3: 'Resource with incomplete author',
                        },
                    ],
                },
            ]);
        });

        it('should list annotations with their resource and field', async () => {
            const ctx = {
                request: {
                    query: {},
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 4,
                fullTotal: 4,
                data: [
                    {
                        ...annotationList[3],
                        resource: {
                            uri: annotationList[3].resourceUri,
                            title: 'A subresource',
                        },
                        field: field3,
                    },
                    {
                        ...annotationList[0],
                        resource: {
                            uri: ANNOTATIONS[0].resourceUri,
                            title: 'Developer resource',
                        },
                        field: field1,
                    },
                    { ...annotationList[1], resource: undefined, field: null },
                    {
                        ...annotationList[2],
                        resource: {
                            uri: annotationList[2].resourceUri,
                            title: 'Resource with incomplete author',
                        },
                        field: field2,
                    },
                ],
            });
        });

        it('should list annotations with pagination', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 1,
                        perPage: 2,
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);
            expect(ctx.body).toStrictEqual({
                total: 2,
                fullTotal: 4,
                data: [
                    {
                        ...annotationList[1],
                        resource: undefined,
                        field: null,
                    },
                    {
                        ...annotationList[2],
                        resource: {
                            uri: annotationList[2].resourceUri,
                            title: 'Resource with incomplete author',
                        },
                        field: field2,
                    },
                ],
            });
        });

        it('should allow to filter by resourceUri', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'resourceUri',
                        filterOperator: 'contains',
                        filterValue: ANNOTATIONS[0].resourceUri,
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 1,
                fullTotal: 1,
                data: [
                    {
                        ...annotationList[0],
                        resource: {
                            uri: annotationList[0].resourceUri,
                            title: 'Developer resource',
                        },
                        field: field1,
                    },
                ],
            });
        });

        it('should allow to filter by resource.title', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'resource.title',
                        filterOperator: 'contains',
                        filterValue: 'Developer resource',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 1,
                fullTotal: 1,
                data: [
                    {
                        ...annotationList[0],
                        resource: {
                            uri: annotationList[0].resourceUri,
                            title: 'Developer resource',
                        },
                        field: field1,
                    },
                ],
            });
        });

        it('should allow to filter by comment', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'comment',
                        filterOperator: 'contains',
                        filterValue: 'comment',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 2,
                fullTotal: 2,
                data: [
                    {
                        ...annotationList[0],
                        resource: {
                            uri: annotationList[0].resourceUri,
                            title: 'Developer resource',
                        },
                        field: field1,
                    },
                    {
                        ...annotationList[1],
                        resource: undefined,
                        field: null,
                    },
                ],
            });
        });

        it('should allow to filter by createdAt (is)', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'createdAt',
                        filterOperator: 'is',
                        filterValue: '02-01-2025',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 1,
                fullTotal: 1,
                data: [
                    {
                        ...annotationList[1],
                        resource: undefined,
                        field: null,
                    },
                ],
            });
        });

        it('should allow to filter by createdAt (after)', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'createdAt',
                        filterOperator: 'after',
                        filterValue: '02-01-2025',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 2,
                fullTotal: 3,
                data: [
                    {
                        ...annotationList[3],
                        resource: {
                            uri: annotationList[3].resourceUri,
                            title: 'A subresource',
                        },
                        field: field3,
                    },
                    {
                        ...annotationList[0],
                        resource: {
                            uri: annotationList[0].resourceUri,
                            title: 'Developer resource',
                        },
                        field: field1,
                    },
                ],
            });
        });

        it('should allow to filter by createdAt (before)', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'createdAt',
                        filterOperator: 'before',
                        filterValue: '02-01-2025',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 2,
                fullTotal: 2,
                data: [
                    {
                        ...annotationList[1],
                        resource: undefined,
                        field: null,
                    },
                    {
                        ...annotationList[2],
                        resource: {
                            uri: annotationList[2].resourceUri,
                            title: 'Resource with incomplete author',
                        },
                        field: field2,
                    },
                ],
            });
        });

        it('should allow to filter by updatedAt (is)', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'updatedAt',
                        filterOperator: 'is',
                        filterValue: '02-01-2025',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 1,
                fullTotal: 1,
                data: [
                    {
                        ...annotationList[1],
                        resource: undefined,
                        field: null,
                    },
                ],
            });
        });

        it('should allow to filter by updatedAt (after)', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'updatedAt',
                        filterOperator: 'after',
                        filterValue: '02-01-2025',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 2,
                fullTotal: 3,
                data: [
                    {
                        ...annotationList[3],
                        resource: {
                            uri: annotationList[3].resourceUri,
                            title: 'A subresource',
                        },
                        field: field3,
                    },
                    {
                        ...annotationList[0],
                        resource: {
                            uri: annotationList[0].resourceUri,
                            title: 'Developer resource',
                        },
                        field: field1,
                    },
                ],
            });
        });

        it('should allow to filter by updatedAt (before)', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'updatedAt',
                        filterOperator: 'before',
                        filterValue: '02-01-2025',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 2,
                fullTotal: 2,
                data: [
                    {
                        ...annotationList[1],
                        resource: undefined,
                        field: null,
                    },
                    {
                        ...annotationList[2],
                        resource: {
                            uri: annotationList[2].resourceUri,
                            title: 'Resource with incomplete author',
                        },
                        field: field2,
                    },
                ],
            });
        });

        it('should allow to filter by field label', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'field.label',
                        filterOperator: 'contains',
                        filterValue: 'field 2',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 1,
                fullTotal: 1,
                data: [
                    {
                        ...annotationList[2],
                        resource: {
                            uri: annotationList[2].resourceUri,
                            title: 'Resource with incomplete author',
                        },
                        field: field2,
                    },
                ],
            });
        });

        it('should allow to filter by field name', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'field.name',
                        filterOperator: 'contains',
                        filterValue: 'field1',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 1,
                fullTotal: 1,
                data: [
                    {
                        ...annotationList[0],
                        resource: {
                            uri: annotationList[0].resourceUri,
                            title: 'Developer resource',
                        },
                        field: field1,
                    },
                ],
            });
        });

        it('should allow to filter by field internalName', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'field.internalName',
                        filterOperator: 'contains',
                        filterValue: 'field_2',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 1,
                fullTotal: 1,
                data: [
                    {
                        ...annotationList[2],
                        resource: {
                            uri: annotationList[2].resourceUri,
                            title: 'Resource with incomplete author',
                        },
                        field: field2,
                    },
                ],
            });
        });

        it('should allow to filter by field internalScopes', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'field.internalScopes',
                        filterOperator: 'contains',
                        filterValue: 'document',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 1,
                fullTotal: 1,
                data: [
                    {
                        ...annotationList[2],
                        resource: {
                            uri: annotationList[2].resourceUri,
                            title: 'Resource with incomplete author',
                        },
                        field: field2,
                    },
                ],
            });
        });

        it('should allow to filter by status', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'status',
                        filterOperator: 'contains',
                        filterValue: 'ongoing',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 1,
                fullTotal: 1,
                data: [
                    {
                        ...annotationList[0],
                        resource: {
                            uri: annotationList[0].resourceUri,
                            title: 'Developer resource',
                        },
                        field: field1,
                    },
                ],
            });
        });

        it('should allow to filter by internal comment', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'internalComment',
                        filterOperator: 'contains',
                        filterValue: 'further details',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 1,
                fullTotal: 1,
                data: [
                    {
                        ...annotationList[1],
                        resource: undefined,
                        field: null,
                    },
                ],
            });
        });

        it('should allow to filter by administrator', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'administrator',
                        filterOperator: 'contains',
                        filterValue: 'Sandrine',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 1,
                fullTotal: 1,
                data: [
                    {
                        ...annotationList[0],
                        resource: {
                            uri: annotationList[0].resourceUri,
                            title: 'Developer resource',
                        },
                        field: field1,
                    },
                ],
            });
        });

        it('should order results', async () => {
            const ctx = {
                request: {
                    query: {
                        sortBy: 'resourceUri',
                        sortDir: 'asc',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);
            expect(ctx.body).toStrictEqual({
                total: 4,
                fullTotal: 4,
                data: [
                    { ...annotationList[1], resource: undefined, field: null },
                    {
                        ...annotationList[0],
                        resource: {
                            uri: annotationList[0].resourceUri,
                            title: 'Developer resource',
                        },
                        field: field1,
                    },
                    {
                        ...annotationList[3],
                        resource: {
                            uri: annotationList[3].resourceUri,
                            title: 'A subresource',
                        },
                        field: field3,
                    },
                    {
                        ...annotationList[2],
                        resource: {
                            uri: annotationList[2].resourceUri,
                            title: 'Resource with incomplete author',
                        },
                        field: field2,
                    },
                ],
            });
        });

        it('should return an error if query is not valid', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 1,
                        perPage: 2,
                        filterBy: 'test',
                        filterOperator: 'contains',
                        filterValue: 'test',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(400);
            expect(ctx.body).toStrictEqual({
                total: 0,
                fullTotal: 0,
                errors: [
                    {
                        code: 'invalid_enum_value',
                        message: 'annotation_query_filter_by_invalid_key',
                        path: ['filterBy'],
                        options: [
                            'resource.title',
                            'authorName',
                            'resourceUri',
                            'fieldId',
                            'comment',
                            'initialValue',
                            'status',
                            'internalComment',
                            'administrator',
                            'createdAt',
                            'updatedAt',
                            'field.label',
                            'field.name',
                            'field.internalName',
                            'field.internalScopes',
                        ],
                        received: 'test',
                    },
                ],
                data: [],
            });
        });
    });

    describe('GET /annotations/:id', () => {
        let annotation;
        let field;
        beforeEach(async () => {
            await fieldModel.create({ position: 1, overview: 1 }, 'tItL3');

            field = await fieldModel.create(
                {
                    position: 2,
                    label: 'Annotated field',
                },
                'GvaF',
            );

            await publishedDatasetModel.create({
                uri: 'uid:/1234',
                tItL3: 'resource title',
            });

            annotation = await annotationModel.create({
                resourceUri: 'uid:/1234',
                itemPath: [],
                fieldId: field._id,
                authorName: 'Developer',
                authorEmail: 'developer@marmelab.com',
                comment: 'This is a comment',
                status: 'ongoing',
                internalComment: null,
                createdAt: new Date('03-01-2025'),
                updatedAt: new Date('03-01-2025'),
            });
        });

        it('should return target annotation with resource and field', async () => {
            const ctx = {
                annotation: annotationModel,
                field: fieldModel,
                publishedDataset: publishedDatasetModel,
                response: {},
            };

            await getAnnotation(ctx, annotation._id);

            expect(ctx.response).toStrictEqual({
                body: {
                    _id: annotation._id,
                    authorEmail: 'developer@marmelab.com',
                    authorName: 'Developer',
                    comment: 'This is a comment',
                    createdAt: expect.any(Date),
                    field: {
                        _id: field._id,
                        label: 'Annotated field',
                        name: 'GvaF',
                        position: 2,
                    },
                    fieldId: field._id,
                    internalComment: null,
                    itemPath: [],
                    resource: {
                        title: 'resource title',
                        uri: 'uid:/1234',
                    },
                    resourceUri: 'uid:/1234',
                    status: 'ongoing',
                    updatedAt: expect.any(Date),
                },
                status: 200,
            });
        });

        it('should return target annotation with field at null when it does not exists', async () => {
            annotation = await annotationModel.create({
                resourceUri: 'uid:/1234',
                itemPath: [],
                fieldId: '404',
                authorName: 'Developer',
                authorEmail: 'developer@marmelab.com',
                comment: 'This is a comment',
                status: 'ongoing',
                internalComment: null,
                createdAt: new Date('03-01-2025'),
                updatedAt: new Date('03-01-2025'),
            });
            const ctx = {
                annotation: annotationModel,
                field: fieldModel,
                publishedDataset: publishedDatasetModel,
                response: {},
            };

            await getAnnotation(ctx, annotation._id);

            expect(ctx.response).toStrictEqual({
                body: {
                    _id: annotation._id,
                    authorEmail: 'developer@marmelab.com',
                    authorName: 'Developer',
                    comment: 'This is a comment',
                    createdAt: expect.any(Date),
                    field: null,
                    fieldId: '404',
                    internalComment: null,
                    itemPath: [],
                    resource: {
                        title: 'resource title',
                        uri: 'uid:/1234',
                    },
                    resourceUri: 'uid:/1234',
                    status: 'ongoing',
                    updatedAt: expect.any(Date),
                },
                status: 200,
            });
        });

        it('should return target annotation with resource at null when it does not exists', async () => {
            annotation = await annotationModel.create({
                resourceUri: 'uid:/404',
                itemPath: [],
                fieldId: field._id,
                authorName: 'Developer',
                authorEmail: 'developer@marmelab.com',
                comment: 'This is a comment',
                status: 'ongoing',
                internalComment: null,
                createdAt: new Date('03-01-2025'),
                updatedAt: new Date('03-01-2025'),
            });
            const ctx = {
                annotation: annotationModel,
                field: fieldModel,
                publishedDataset: publishedDatasetModel,
                response: {},
            };

            await getAnnotation(ctx, annotation._id);

            expect(ctx.response).toStrictEqual({
                body: {
                    _id: annotation._id,
                    authorEmail: 'developer@marmelab.com',
                    authorName: 'Developer',
                    comment: 'This is a comment',
                    createdAt: expect.any(Date),
                    field,
                    fieldId: field._id,
                    internalComment: null,
                    itemPath: [],
                    resource: null,
                    resourceUri: 'uid:/404',
                    status: 'ongoing',
                    updatedAt: expect.any(Date),
                },
                status: 200,
            });
        });

        it('should return 404 status when target annotation does not exists', async () => {
            const ctx = {
                annotation: annotationModel,
                field: fieldModel,
                publishedDataset: publishedDatasetModel,
                response: {},
            };

            await getAnnotation(ctx, '404');

            expect(ctx.response).toStrictEqual({
                status: 404,
            });
        });

        it('should return target annotation with subresource and field', async () => {
            const ctx = {
                annotation: annotationModel,
                field: fieldModel,
                publishedDataset: publishedDatasetModel,
                response: {},
            };

            await ctx.field.create(
                {
                    position: 3,
                    label: 'field 3',
                    internalName: 'field_3',
                    internalScopes: ['home'],
                    subresourceId: '2dee944d-efb0-4b0f-be12-7f5938db7f8a',
                    overview: 5,
                },
                'hzBla',
            );

            await ctx.publishedDataset.insertBatch([
                {
                    uri: ANNOTATIONS[3].resourceUri,
                    versions: [
                        {
                            hzBla: 'A subresource',
                        },
                    ],
                    subresourceId: '2dee944d-efb0-4b0f-be12-7f5938db7f8a',
                },
            ]);

            const annotation = await ctx.annotation.create(ANNOTATIONS[3]);

            await getAnnotation(ctx, annotation._id);

            expect(ctx.response).toMatchObject({
                body: {
                    ...ANNOTATIONS[3],
                    field: null,
                    resource: {
                        uri: ANNOTATIONS[3].resourceUri,
                        title: 'A subresource',
                    },
                },
                status: 200,
            });
        });
    });

    describe('PUT /annotations/:id', () => {
        let annotation;
        let field;
        beforeEach(async () => {
            await fieldModel.create({ position: 1, overview: 1 }, 'tItL3');

            field = await fieldModel.create(
                {
                    position: 2,
                    label: 'Annotated field',
                },
                'GvaF',
            );

            await publishedDatasetModel.create({
                uri: 'uid:/1234',
                tItL3: 'resource title',
            });

            annotation = await annotationModel.create({
                resourceUri: 'uid:/1234',
                itemPath: [],
                fieldId: field._id,
                authorName: 'Developer',
                authorEmail: 'developer@marmelab.com',
                comment: 'This is a comment',
                status: 'ongoing',
                internalComment: null,
                createdAt: new Date('03-01-2025'),
                updatedAt: new Date('03-01-2025'),
            });
        });

        it('should update target annotation', async () => {
            const ctx = {
                request: {
                    body: {
                        status: 'validated',
                        internalComment: 'All done',
                        administrator: 'The Tester',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await updateAnnotation(ctx, annotation._id);

            expect(ctx.response).toStrictEqual({
                status: 200,
                body: {
                    data: {
                        ...annotation,
                        status: 'validated',
                        internalComment: 'All done',
                        administrator: 'The Tester',
                        updatedAt: expect.any(Date),
                    },
                },
            });
            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([
                ctx.response.body.data,
            ]);
        });

        it('should fail with a 404 if target annotation does not exists', async () => {
            const ctx = {
                request: {
                    body: {
                        status: 'validated',
                        internalComment: 'All done',
                        administrator: 'The Tester',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };
            await updateAnnotation(ctx, '404');

            expect(ctx.response).toStrictEqual({
                status: 404,
            });
            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([
                annotation,
            ]);
        });

        it('should fail with a 400 if data does not pass validation', async () => {
            const ctx = {
                request: {
                    body: {},
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };
            await updateAnnotation(ctx, annotation._id);

            expect(ctx.response).toStrictEqual({
                status: 400,
                body: {
                    errors: [
                        {
                            code: 'invalid_type',
                            expected:
                                "'to_review' | 'ongoing' | 'validated' | 'rejected'",
                            message: 'Required',
                            path: ['status'],
                            received: 'undefined',
                        },
                        {
                            code: 'invalid_type',
                            expected: 'string',
                            message: 'error_required',
                            path: ['internalComment'],
                            received: 'undefined',
                        },
                    ],
                },
            });
            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([
                annotation,
            ]);
        });
    });
});
