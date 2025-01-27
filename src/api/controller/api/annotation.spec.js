import { createAnnotation, getAnnotations } from './annotation';
import { MongoClient, ObjectId } from 'mongodb';
import createAnnotationModel from '../../models/annotation';
import createFieldModel from '../../models/field';
import createPublishedDatasetModel from '../../models/publishedDataset';
import { createAnnotation, getAnnotations } from './annotation';

const ANNOTATIONS = [
    {
        resourceUri: 'uid:/65257776-4e3c-44f6-8652-85502a97e5ac',
        itemPath: ['GvaF'],
        authorName: 'Developer',
        authorEmail: 'developer@marmelab.com',
        comment: 'This is a comment',
        status: 'in_progress',
        internal_comment: null,
        createdAt: new Date('03-01-2025'),
        updatedAt: new Date('03-01-2025'),
    },
    {
        resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
        itemPath: null,
        authorName: 'John DOE',
        authorEmail: 'john.doe@marmelab.com',
        comment: 'This is another comment',
        status: 'to_review',
        internal_comment: null,
        createdAt: new Date('02-01-2025'),
        updatedAt: new Date('02-01-2025'),
    },
    {
        resourceUri: 'uid:/d4f1e376-d5dd-4853-b515-b7f63b34d67d',
        itemPath: [],
        authorName: 'Jane SMITH',
        authorEmail: 'jane.smith@marmelab.com',
        comment: 'The author list is incomplete: it should include Jane SMITH',
        status: 'rejected',
        internal_comment: null,
        createdAt: new Date('01-01-2025'),
        updatedAt: new Date('01-01-2025'),
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
                itemPath: ['Gb4a'],
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
                    internal_comment: null,
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

        beforeEach(async () => {
            await fieldModel.create(
                {
                    overview: 1,
                    position: 0,
                },
                'tItl3',
            );

            const field1 = await fieldModel.create(
                {
                    position: 1,
                    label: 'field 1',
                },
                'field1',
            );

            const field2 = await fieldModel.create(
                {
                    position: 2,
                    label: 'field 2',
                },
                'field2',
            );
            annotationList = await Promise.all([
                annotationModel.create({
                    ...ANNOTATIONS[0],
                    itemPath: [field1._id],
                }),
                annotationModel.create(ANNOTATIONS[1]),
                annotationModel.create({
                    ...ANNOTATIONS[2],
                    itemPath: [field2._id],
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
                total: 3,
                fullTotal: 3,
                data: [
                    {
                        ...annotationList[0],
                        resource: {
                            uri: ANNOTATIONS[0].resourceUri,
                            title: 'Developer resource',
                        },
                        field: {
                            _id: expect.any(ObjectId),
                            label: 'field 1',
                            name: 'field1',
                            position: 1,
                        },
                    },
                    { ...annotationList[1], resource: undefined, field: null },
                    {
                        ...annotationList[2],
                        resource: {
                            uri: annotationList[2].resourceUri,
                            title: 'Resource with incomplete author',
                        },
                        field: {
                            _id: expect.any(ObjectId),
                            label: 'field 2',
                            name: 'field2',
                            position: 2,
                        },
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
                total: 1,
                fullTotal: 3,
                data: [
                    {
                        ...annotationList[2],
                        resource: {
                            uri: annotationList[2].resourceUri,
                            title: 'Resource with incomplete author',
                        },
                        field: {
                            _id: expect.any(ObjectId),
                            label: 'field 2',
                            name: 'field2',
                            position: 2,
                        },
                    },
                ],
            });
        });

        it('should apply filters', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 1,
                        perPage: 2,
                        filterBy: 'resourceUri',
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

            expect(ctx.response.status).toBe(200);

            expect(ctx.body).toStrictEqual({
                total: 1,
                fullTotal: 3,
                data: [
                    {
                        ...annotationList[2],
                        resource: {
                            uri: annotationList[2].resourceUri,
                            title: 'Resource with incomplete author',
                        },
                        field: {
                            _id: expect.any(ObjectId),
                            label: 'field 2',
                            name: 'field2',
                            position: 2,
                        },
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
                total: 3,
                fullTotal: 3,
                data: [
                    { ...annotationList[1], resource: undefined, field: null },
                    {
                        ...annotationList[0],
                        resource: {
                            uri: annotationList[0].resourceUri,
                            title: 'Developer resource',
                        },
                        field: {
                            _id: expect.any(ObjectId),
                            label: 'field 1',
                            name: 'field1',
                            position: 1,
                        },
                    },
                    {
                        ...annotationList[2],
                        resource: {
                            uri: annotationList[2].resourceUri,
                            title: 'Resource with incomplete author',
                        },
                        field: {
                            _id: expect.any(ObjectId),
                            label: 'field 2',
                            name: 'field2',
                            position: 2,
                        },
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
                            'createdAt',
                        ],
                        received: 'test',
                    },
                ],
                data: [],
            });
        });
    });
});
