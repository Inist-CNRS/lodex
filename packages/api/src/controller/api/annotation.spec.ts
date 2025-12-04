import { ADMIN_ROLE, CONTRIBUTOR_ROLE, USER_ROLE } from '@lodex/common';
import { default as _ } from 'lodash';
import { MongoClient } from 'mongodb';
import { text } from 'stream/consumers';
import createAnnotationModel from '../../models/annotation';
import configTenant from '../../models/configTenant';
import createFieldModel from '../../models/field';
import createPublishedDatasetModel from '../../models/publishedDataset';
import { sendMail } from '../../services/mail/mailer';
import {
    canAnnotateRoute,
    createAnnotation,
    deleteAnnotation,
    deleteManyAnnotationByFilter,
    deleteManyAnnotationById,
    exportAnnotations,
    getAnnotation,
    getAnnotations,
    getFieldAnnotations,
    updateAnnotation,
} from './annotation';
import { verifyReCaptchaToken } from './recaptcha';

jest.mock('../../services/mail/mailer', () => ({
    sendMail: jest.fn(),
}));

const ANNOTATIONS = [
    {
        resourceUri: 'uid:/65257776-4e3c-44f6-8652-85502a97e5ac',
        kind: 'comment',
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
        kind: 'comment',
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
        kind: 'comment',
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
        kind: 'removal',
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

jest.mock('./recaptcha', () => ({
    verifyReCaptchaToken: jest.fn(),
}));

describe('annotation', () => {
    const connectionStringURI = process.env.MONGO_URL;
    let annotationModel: any;
    let publishedDatasetModel: any;
    let configTenantModel: any;
    let fieldModel: any;
    let connection: any;
    let db: any;
    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI!);
        db = connection.db();
        annotationModel = await createAnnotationModel(db);
        fieldModel = await createFieldModel(db);
        publishedDatasetModel = await createPublishedDatasetModel(db);
        configTenantModel = await configTenant(db);
    });

    beforeEach(async () => {
        await db.collection('publishedDataset').deleteMany({});
        await db.collection('field').deleteMany({});
        await db.collection('annotation').deleteMany({});
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await db.dropDatabase();
        await connection.close();
    });

    describe('createAnnotation', () => {
        beforeEach(() => {
            // @ts-expect-error TS(2339): Property 'mockClear' does not exist on type '({ to... Remove this comment to see the full error message
            sendMail.mockClear();
        });

        it('should create an annotation', async () => {
            jest.mocked(verifyReCaptchaToken).mockResolvedValue({
                success: true,
                score: 1.0,
            });
            await configTenantModel.create({
                contributorAuth: {
                    active: false,
                },
            });
            const annotation = {
                resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
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
                configTenantCollection: configTenantModel,
            };

            await createAnnotation(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
                // @ts-expect-error TS(2339): Property 'body' does not exist on type '{ request:... Remove this comment to see the full error message
                ctx.body.data,
            ]);

            expect(verifyReCaptchaToken).toHaveBeenCalledWith(
                ctx,
                expect.objectContaining(annotation),
            );
            expect(sendMail).not.toHaveBeenCalled();
        });

        it('should create an annotation and send a french notification when when a notificationEmail is set and locale is fr', async () => {
            await configTenantModel.create({
                contributorAuth: {
                    active: false,
                },
                notificationEmail: 'admin@inist.fr',
            });
            const annotation = {
                resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                fieldId: 'Gb4a',
                kind: 'comment',
                comment: 'Hello world',
                authorName: 'John DOE',
            };

            const ctx = {
                request: {
                    body: annotation,
                    query: {
                        locale: 'en',
                    },
                    header: {
                        origin: 'http://localhost:3000',
                    },
                },
                tenant: 'instance-name',
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
                configTenantCollection: configTenantModel,
            };

            await createAnnotation(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
                // @ts-expect-error TS(2339): Property 'body' does not exist on type '{ request:... Remove this comment to see the full error message
                ctx.body.data,
            ]);

            expect(sendMail).toHaveBeenCalledWith({
                subject: 'An annotation has been added on « instance-name »',
                to: 'admin@inist.fr',
                text: `An annotation has been added on « instance-name »
Type : Comment
Contributor: John DOE
Contributor comment: Hello world
See annotation: http://localhost:3000/instance/instance-name/admin#/annotations`,
            });
        });

        it('should create an annotation and send a notification when when a notificationEmail is set', async () => {
            await configTenantModel.create({
                contributorAuth: {
                    active: false,
                },
                notificationEmail: 'admin@inist.fr',
            });
            const annotation = {
                resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                fieldId: 'Gb4a',
                kind: 'comment',
                comment: 'Hello world',
                authorName: 'John DOE',
            };

            const ctx = {
                request: {
                    body: annotation,
                    query: {
                        locale: 'fr',
                    },
                    header: {
                        origin: 'http://localhost:3000',
                    },
                },
                tenant: 'instance-name',
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
                configTenantCollection: configTenantModel,
            };

            await createAnnotation(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
                // @ts-expect-error TS(2339): Property 'body' does not exist on type '{ request:... Remove this comment to see the full error message
                ctx.body.data,
            ]);

            expect(sendMail).toHaveBeenCalledWith({
                subject: 'Une annotation a été ajoutée sur « instance-name »',
                to: 'admin@inist.fr',
                text: `Une annotation a été ajoutée sur « instance-name »
Type : Commentaire
Contributeur : John DOE
Commentaire du contributeur : Hello world
Voir l'annotation : http://localhost:3000/instance/instance-name/admin#/annotations`,
            });
        });

        it('should forbid to create an annotation if contributorAuth is active and user role is not contributor nor admin', async () => {
            jest.mocked(verifyReCaptchaToken).mockResolvedValue({
                success: true,
                score: 1.0,
            });
            await configTenantModel.create({
                contributorAuth: {
                    active: true,
                },
            });
            const annotation = {
                resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
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
                configTenantCollection: configTenantModel,
            };

            await createAnnotation(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(403);

            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([]);
        });
        it('should create an annotation if contributorAuth is active and user role is contributor', async () => {
            jest.mocked(verifyReCaptchaToken).mockResolvedValue({
                success: true,
                score: 1.0,
            });
            await configTenantModel.create({
                contributorAuth: {
                    active: true,
                },
            });
            const annotation = {
                resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                fieldId: 'Gb4a',
                kind: 'comment',
                comment: 'Hello world',
                authorName: 'John DOE',
            };

            const ctx = {
                request: {
                    body: annotation,
                },
                state: {
                    header: {
                        role: CONTRIBUTOR_ROLE,
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
                configTenantCollection: configTenantModel,
            };

            await createAnnotation(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([
                // @ts-expect-error TS(2339): Property 'body' does not exist on type '{ request:... Remove this comment to see the full error message
                ctx.body.data,
            ]);
        });
        it('should create an annotation if contributorAuth is active and user role is admin', async () => {
            jest.mocked(verifyReCaptchaToken).mockResolvedValue({
                success: true,
                score: 1.0,
            });
            await configTenantModel.create({
                contributorAuth: {
                    active: true,
                },
            });
            const annotation = {
                resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                fieldId: 'Gb4a',
                kind: 'comment',
                comment: 'Hello world',
                authorName: 'John DOE',
            };

            const ctx = {
                request: {
                    body: annotation,
                },
                state: {
                    header: {
                        role: 'admin',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
                configTenantCollection: configTenantModel,
            };

            await createAnnotation(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([
                // @ts-expect-error TS(2339): Property 'body' does not exist on type '{ request:... Remove this comment to see the full error message
                ctx.body.data,
            ]);
        });
        it('should return an error if annotation is not valid', async () => {
            jest.mocked(verifyReCaptchaToken).mockResolvedValue({
                success: true,
                score: 1.0,
            });
            await configTenantModel.create({
                contributorAuth: {
                    active: false,
                },
            });
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
                configTenantCollection: configTenantModel,
                field: fieldModel,
            };

            await createAnnotation(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(400);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toMatchObject({
                total: 0,
                errors: [
                    {
                        path: ['authorName'],
                        message: 'error_required',
                    },
                ],
            });
            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([]);
        });
        it.each([
            [false, 1.0],
            [true, 0.49],
        ])(
            'should return a 400 error if recaptcha token validation fails when success is %s and score is %s',
            async (success: any, score: any) => {
                jest.mocked(verifyReCaptchaToken).mockResolvedValue({
                    success,
                    score,
                });

                await configTenantModel.create({
                    contributorAuth: {
                        active: false,
                    },
                });
                const annotation = {
                    resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
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
                    configTenantCollection: configTenantModel,
                };

                await createAnnotation(ctx);

                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                expect(ctx.response.status).toBe(400);
                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                expect(ctx.body).toMatchObject({
                    total: 0,
                    errors: [
                        {
                            message: 'error_recaptcha_verification_failed',
                        },
                    ],
                });

                expect(await annotationModel.findLimitFromSkip()).toStrictEqual(
                    [],
                );

                expect(verifyReCaptchaToken).toHaveBeenCalledWith(
                    ctx,
                    expect.objectContaining(annotation),
                );
            },
        );
    });

    describe('getAnnotations', () => {
        let annotationList: any;
        let field1: any;
        let field2: any;
        let field3: any;

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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

        it('should allow to filter by resourceUri using contains', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'resourceUri',
                        filterOperator: 'contains',
                        filterValue: '85502a97e5ac',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

        it('should allow to filter by resourceUri using equals', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'resourceUri',
                        filterOperator: 'equals',
                        filterValue: ANNOTATIONS[0].resourceUri,
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
                        filterOperator: 'equals',
                        filterValue: 'ongoing',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(400);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
                            'kind',
                            'authorName',
                            'resourceUri',
                            'fieldId',
                            'comment',
                            'initialValue',
                            'proposedValue',
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

        it('should allow to filter by kind', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 0,
                        perPage: 2,
                        filterBy: 'kind',
                        filterOperator: 'equals',
                        filterValue: 'removal',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await getAnnotations(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toStrictEqual({
                total: 1,
                fullTotal: 1,
                data: [
                    {
                        ...annotationList[3],
                        resource: {
                            uri: annotationList[3].resourceUri,
                            title: 'A subresource',
                        },
                        field: field3,
                    },
                ],
            });
        });
    });

    describe('GET /annotations/export', () => {
        const annotationsPayload = [
            {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                fieldId: 'GvaF',
                kind: 'comment',
                authorName: 'Developer',
                authorEmail: 'developer@marmelab.com',
                comment: 'This is a comment',
                status: 'in_progress',
                internalComment: 'This is an internal comment',
                createdAt: new Date('03-01-2025'),
            },
            {
                resourceUri: 'uid:/65257776-4e3c-44f6-8652-85502a97e5ac',
                fieldId: null,
                kind: 'comment',
                authorName: 'John DOE',
                authorEmail: 'john.doe@marmelab.com',
                comment: 'This is another comment',
                status: 'to_review',
                internalComment: null,
                createdAt: new Date('02-01-2025'),
            },
            {
                resourceUri: 'uid:/d4f1e376-d5dd-4853-b515-b7f63b34d67d',
                fieldId: null,
                kind: 'correction',
                authorName: 'Jane SMITH',
                authorEmail: 'jane.smith@marmelab.com',
                comment:
                    'The author list is incomplete: it should include Jane SMITH',
                status: 'rejected',
                internalComment: 'Jane SMITH is not an author of this document',
                createdAt: new Date('01-01-2025'),
            },
        ];

        let createdField: any;
        let createdAnnotations: any;
        beforeEach(async () => {
            createdField = await fieldModel.create({
                label: 'Annotated field',
                name: 'GvaF',
                position: 2,
            });

            createdAnnotations = await Promise.all(
                annotationsPayload.map((annotation: any) => {
                    if (annotation.fieldId) {
                        annotation.fieldId = createdField._id.toString();
                    }

                    return annotationModel.create(annotation);
                }),
            );
        });

        it('should export annotations without their _id', async () => {
            const ctx = {
                response: {
                    attachment: jest.fn(),
                },
                annotation: annotationModel,
                field: fieldModel,
            };

            await exportAnnotations(ctx);

            expect(ctx.response.attachment).toHaveBeenCalledWith(
                'annotations.json',
            );
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.response.status).toBe(200);
            // @ts-expect-error TS(2339): Property 'body' does not exist on type '{ attachme... Remove this comment to see the full error message
            const jsonBody = await text(ctx.response.body);
            expect(JSON.parse(jsonBody)).toMatchObject(
                createdAnnotations
                    .toSorted((annotation: any) => annotation._id.toString())
                    .map((annotation: any) => {
                        const annotationWithoutId = _.omit(annotation, '_id');
                        const field = annotation.fieldId
                            ? {
                                  name: createdField.name,
                                  label: createdField.label,
                              }
                            : null;

                        return {
                            ...annotationWithoutId,
                            field,
                            createdAt:
                                annotationWithoutId.createdAt.toISOString(),
                            updatedAt:
                                annotationWithoutId.updatedAt.toISOString(),
                        };
                    }),
            );
        });
    });

    describe('GET /annotations/:id', () => {
        let annotation: any;
        let field: any;
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
        let annotation: any;
        let field: any;
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
                        adminComment: 'Your comment has been accepted',
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
                        adminComment: 'Your comment has been accepted',
                        administrator: 'The Tester',
                        updatedAt: expect.any(Date),
                        field: {
                            _id: field._id,
                            label: 'Annotated field',
                            name: 'GvaF',
                            position: 2,
                        },
                        resource: {
                            title: 'resource title',
                            uri: 'uid:/1234',
                        },
                    },
                },
            });
            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([
                {
                    ...annotation,
                    status: 'validated',
                    internalComment: 'All done',
                    adminComment: 'Your comment has been accepted',
                    administrator: 'The Tester',
                    updatedAt: expect.any(Date),
                },
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
                                "'to_review' | 'ongoing' | 'validated' | 'rejected' | 'parking'",
                            message: 'Required',
                            path: ['status'],
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

    describe('DELETE /annotations', () => {
        let firstAnnotation: any, secondAnnotation: any;
        beforeEach(async () => {
            firstAnnotation = await annotationModel.create({
                comment: 'target annotation',
            });
            secondAnnotation = await annotationModel.create({
                comment: 'another annotation',
            });
        });

        it('should succeed with a 200 with deleted annotations', async () => {
            const ctx = {
                request: {
                    body: ['404', firstAnnotation._id.toString()],
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await deleteManyAnnotationById(ctx);

            expect(ctx.response).toStrictEqual({
                status: 200,
                body: {
                    deletedCount: 1,
                },
            });

            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([
                secondAnnotation,
            ]);
        });

        it.each([
            [
                [],
                [
                    {
                        code: 'too_small',
                        exact: false,
                        inclusive: true,
                        message: 'Array must contain at least 1 element(s)',
                        minimum: 1,
                        path: [],
                        type: 'array',
                    },
                ],
            ],
            [
                [1],
                [
                    {
                        code: 'invalid_type',
                        expected: 'string',
                        message: 'Expected string, received number',
                        path: [0],
                        received: 'number',
                    },
                ],
            ],
        ])(
            'should fail with a 400 if ids is not valid',
            async (body: any, errors: any) => {
                const ctx = {
                    request: {
                        body,
                    },
                    response: {},
                    annotation: annotationModel,
                    publishedDataset: publishedDatasetModel,
                    field: fieldModel,
                };

                await deleteManyAnnotationById(ctx);

                expect(ctx.response).toStrictEqual({
                    status: 400,
                    body: {
                        deletedCount: 0,
                        errors,
                    },
                });
            },
        );
    });

    describe('DELETE /annotations/batch-delete-filter', () => {
        beforeEach(async () => {
            await Promise.all([
                annotationModel.create({
                    comment: 'target annotation',
                }),
                annotationModel.create({
                    comment: 'another annotation',
                }),
            ]);
        });

        it('should succeed with a 200 with deleted annotations', async () => {
            const ctx = {
                request: {
                    query: {
                        filterBy: 'comment',
                        filterOperator: 'contains',
                        filterValue: 'target',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await deleteManyAnnotationByFilter(ctx);

            expect(ctx.response).toStrictEqual({
                status: 200,
                body: { status: 'deleted', deletedCount: 1 },
            });

            expect(await annotationModel.findLimitFromSkip()).toMatchObject([
                {
                    comment: 'another annotation',
                },
            ]);
        });

        it('should fail with a 400 if filter is empty', async () => {
            const ctx = {
                request: {
                    query: {},
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await deleteManyAnnotationByFilter(ctx);

            expect(ctx.response).toStrictEqual({
                status: 400,
                body: {
                    status: 'error',
                    error: 'filter parameter is incomplete',
                    deletedCount: 0,
                },
            });
        });

        it('should fail with a 404 if not row has been deleted', async () => {
            const ctx = {
                request: {
                    query: {
                        filterBy: 'comment',
                        filterOperator: 'contains',
                        filterValue: 'target2',
                    },
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await deleteManyAnnotationByFilter(ctx);

            expect(ctx.response).toStrictEqual({
                status: 404,
                body: {
                    status: 'error',
                    error: `no row match the filter`,
                    deletedCount: 0,
                },
            });

            expect(await annotationModel.count({})).toBe(2);
        });
    });

    describe('DELETE /annotations/:id', () => {
        let annotation: any;
        beforeEach(async () => {
            annotation = await annotationModel.create({
                resourceUri: '/',
                fieldId: null,
                authorName: 'Developer',
                authorEmail: 'developer@marmelab.com',
                comment: 'This is a comment',
                status: 'ongoing',
                internalComment: null,
                createdAt: new Date('03-01-2025'),
                updatedAt: new Date('03-01-2025'),
            });
        });

        it('should succeed with a 200 if annotation does not exist', async () => {
            const ctx = {
                request: {
                    body: {},
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await deleteAnnotation(ctx, annotation._id);

            expect(ctx.response).toStrictEqual({
                status: 200,
                body: {
                    success: true,
                },
            });

            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([]);
        });

        it('should fail with a 404 if annotation does not exist', async () => {
            const ctx = {
                request: {
                    body: {},
                },
                response: {},
                annotation: annotationModel,
                publishedDataset: publishedDatasetModel,
                field: fieldModel,
            };

            await deleteAnnotation(ctx, '404404404404404404404404');

            expect(ctx.response).toStrictEqual({
                status: 404,
            });

            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([
                annotation,
            ]);
        });
    });

    describe('GET /annotations/can-access', () => {
        it('should return true when role is contributor and contributorAuth is active', async () => {
            await configTenantModel.create({
                contributorAuth: {
                    active: true,
                },
            });
            const ctx = {
                state: {
                    header: {
                        role: CONTRIBUTOR_ROLE,
                    },
                },
                configTenantCollection: configTenantModel,
            };

            await canAnnotateRoute(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(200);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toBe(true);
        });
        it('should return true when role is admin and contributorAuth is active', async () => {
            await configTenantModel.create({
                contributorAuth: {
                    active: true,
                },
            });
            const ctx = {
                state: {
                    header: {
                        role: 'admin',
                    },
                },
                configTenantCollection: configTenantModel,
            };

            await canAnnotateRoute(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(200);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toBe(true);
        });
        it('should return false when role is user and contributorAuth is active', async () => {
            await configTenantModel.create({
                contributorAuth: {
                    active: true,
                },
            });
            const ctx = {
                state: {
                    header: {
                        role: USER_ROLE,
                    },
                },
                configTenantCollection: configTenantModel,
            };

            await canAnnotateRoute(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(200);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toBe(false);
        });
        it.each([USER_ROLE, CONTRIBUTOR_ROLE, ADMIN_ROLE])(
            'should return true when contributorAuth is not active and role is %s',
            async (role: any) => {
                await configTenantModel.create({
                    contributorAuth: {
                        active: false,
                    },
                });
                const ctx = {
                    state: {
                        header: {
                            role,
                        },
                    },
                    configTenantCollection: configTenantModel,
                };

                await canAnnotateRoute(ctx);

                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                expect(ctx.status).toBe(200);
                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                expect(ctx.body).toBe(true);
            },
        );
    });

    describe('GET /annotations/field-annotations', () => {
        let field: any;
        let otherField;
        let fieldAnnotations: any;
        beforeEach(async () => {
            await fieldModel.create(
                {
                    overview: 1,
                    position: 0,
                },
                'tItl3',
            );
            field = await fieldModel.create(
                {
                    position: 1,
                    label: 'field',
                    internalName: 'field',
                    internalScopes: ['chart'],
                },
                'field',
            );

            otherField = await fieldModel.create(
                {
                    position: 2,
                    label: 'other field',
                    internalName: 'other_field',
                    internalScopes: ['document'],
                },
                'otherField',
            );

            await publishedDatasetModel.create({
                uri: '/resource/1',
                tItl3: 'Resource 1',
            });

            await publishedDatasetModel.create({
                uri: '/resource/2',
                tItl3: 'Resource 2',
            });

            fieldAnnotations = await Promise.all([
                annotationModel.create({
                    resourceUri: '/resource/1',
                    fieldId: field._id,
                }),
                annotationModel.create({
                    resourceUri: '/resource/2',
                    fieldId: field._id,
                }),
                annotationModel.create({
                    resourceUri: '/',
                    fieldId: field._id,
                }),
            ]);

            await Promise.all([
                annotationModel.create({
                    resourceUri: '/resource/1',
                    fieldId: otherField._id,
                }),
                annotationModel.create({
                    resourceUri: '/resource/2',
                    fieldId: otherField._id,
                }),
                annotationModel.create({
                    resourceUri: '/',
                    fieldId: otherField._id,
                }),
            ]);
        });
        it('should return all annotations for a field and no resource', async () => {
            const ctx = {
                request: {
                    query: {
                        fieldId: field._id,
                        resourceUri: '/',
                    },
                },
                response: {},
                annotation: annotationModel,
                field: fieldModel,
                publishedDataset: publishedDatasetModel,
            };

            await getFieldAnnotations(ctx);

            expect(ctx.response).toStrictEqual({
                status: 200,
                body: [{ ...fieldAnnotations[2], field, resource: null }],
            });
        });

        it('should return all annotations for a field and a resource', async () => {
            const ctx = {
                request: {
                    query: {
                        fieldId: field._id,
                        resourceUri: '/resource/1',
                    },
                },
                response: {},
                annotation: annotationModel,
                field: fieldModel,
                publishedDataset: publishedDatasetModel,
            };

            await getFieldAnnotations(ctx);

            expect(ctx.response).toStrictEqual({
                status: 200,
                body: [
                    {
                        ...fieldAnnotations[0],
                        field,
                        resource: {
                            title: 'Resource 1',
                            uri: '/resource/1',
                        },
                    },
                ],
            });
        });

        it('should return an empty array if no annotations are found', async () => {
            const ctx = {
                request: {
                    query: {
                        fieldId: field._id,
                        resourceUri: '/resource/3',
                    },
                },
                response: {},
                annotation: annotationModel,
                field: fieldModel,
                publishedDataset: publishedDatasetModel,
            };

            await getFieldAnnotations(ctx);

            expect(ctx.response).toStrictEqual({
                status: 200,
                body: [],
            });
        });

        it('should return an empty array if the field does not exist', async () => {
            const ctx = {
                request: {
                    query: {
                        fieldName: 'unknown',
                        resourceUri: '/resource/1',
                    },
                },
                response: {},
                annotation: annotationModel,
                field: fieldModel,
                publishedDataset: publishedDatasetModel,
            };

            await getFieldAnnotations(ctx);

            expect(ctx.response).toStrictEqual({
                status: 200,
                body: [],
            });
        });
    });
});
