import { MongoClient, ObjectId } from 'mongodb';
import createAnnotationModel from './annotation';

describe('annotation', () => {
    const connectionStringURI = process.env.MONGODB_URI_FOR_TESTS as string;
    let db: any;
    let connection: any;
    let annotationModel: any;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI);
        db = connection.db();
        annotationModel = await createAnnotationModel(db);
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => db.dropDatabase());

    describe('create', () => {
        it('should create a new annotation', async () => {
            const annotation = {
                resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                fieldId: 'Gb4a',
                kind: 'comment',
                authorName: 'Rick HARRIS',
                authorEmail: 'rick.harris@marmelab.com',
                comment: 'Hello world',
            };

            const result = await annotationModel.create(annotation);
            expect(result).toStrictEqual({
                ...annotation,
                _id: expect.any(ObjectId),
                internalComment: null,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                status: 'to_review',
            });

            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([
                result,
            ]);
        });

        it('should not persist reCaptchaToken', async () => {
            const annotation = {
                resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                fieldId: 'Gb4a',
                kind: 'comment',
                authorName: 'Rick HARRIS',
                authorEmail: 'rick.harris@marmelab.com',
                comment: 'Hello world',
            };

            const result = await annotationModel.create({
                ...annotation,
                reCaptchaToken: 'recaptcha.token',
            });
            expect(result).toStrictEqual({
                ...annotation,
                _id: expect.any(ObjectId),
                internalComment: null,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                status: 'to_review',
            });

            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([
                result,
            ]);
        });
    });

    describe('updateOneById', () => {
        it('should update target annotation', async () => {
            const date = new Date();
            const annotation = await annotationModel.create({
                resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                fieldId: 'Gb4a',
                kind: 'comment',
                authorName: 'Rick HARRIS',
                authorEmail: 'rick.harris@marmelab.com',
                comment: 'Hello world',
            });

            const result = await annotationModel.updateOneById(
                annotation._id,
                {
                    status: 'ongoing',
                    internalComment: 'To test thoroughly',
                    administrator: 'The Tester',
                },
                date,
            );

            expect(result).toStrictEqual({
                ...annotation,
                updatedAt: date,
                status: 'ongoing',
                internalComment: 'To test thoroughly',
                administrator: 'The Tester',
            });

            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([
                result,
            ]);
        });
        it('should return null and do nothing if target does not exists', async () => {
            const date = new Date();

            const result = await annotationModel.updateOneById(
                '404',
                {
                    status: 'ongoing',
                    internalComment: 'To test thoroughly',
                    administrator: 'The Tester',
                },
                date,
            );

            expect(result).toBeNull();

            expect(await annotationModel.findLimitFromSkip()).toStrictEqual([]);
        });
    });

    describe('findAll', () => {
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

        let createdAnnotations: any;
        beforeEach(async () => {
            createdAnnotations = await Promise.all(
                annotationsPayload.map(annotationModel.create),
            );
        });

        it('should return an array of annotations', async () => {
            const result = await annotationModel
                .findAll()
                .then((cursor: any) => cursor.toArray());

            expect(
                result.toSorted((a: any, b: any) => b.createdAt - a.createdAt),
            ).toEqual(createdAnnotations);
        });
    });

    describe('findLimitFromSkip', () => {
        let annotationList: any;
        beforeEach(async () => {
            annotationList = await Promise.all(
                [
                    {
                        resourceUri:
                            'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
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
                        resourceUri:
                            'uid:/65257776-4e3c-44f6-8652-85502a97e5ac',
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
                        resourceUri:
                            'uid:/d4f1e376-d5dd-4853-b515-b7f63b34d67d',
                        fieldId: null,
                        kind: 'correction',
                        authorName: 'Jane SMITH',
                        authorEmail: 'jane.smith@marmelab.com',
                        comment:
                            'The author list is incomplete: it should include Jane SMITH',
                        status: 'rejected',
                        internalComment:
                            'Jane SMITH is not an author of this document',
                        createdAt: new Date('01-01-2025'),
                    },
                ].map(annotationModel.create),
            );
        });
        it('should return an array of annotations', async () => {
            const result = await annotationModel.findLimitFromSkip({
                skip: 0,
                limit: 10,
            });

            expect(result).toEqual(annotationList);
        });

        it('should apply skip parameter', async () => {
            const result = await annotationModel.findLimitFromSkip({
                skip: 1,
            });

            expect(result).toEqual(annotationList.slice(1, 3));
        });

        it('should apply limit parameter', async () => {
            const result = await annotationModel.findLimitFromSkip({
                limit: 1,
            });

            expect(result).toEqual(annotationList.slice(0, 1));
        });
    });

    describe('count', () => {
        it('should return document count', async () => {
            expect(await annotationModel.count({})).toBe(0);
            await annotationModel.create({
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                fieldId: 'GvaF',
                kind: 'comment',
                authorName: 'Developer',
                authorEmail: 'developer@marmelab.com',
                comment: 'This is a comment',
                status: 'in_progress',
                internalComment: 'This is an internal comment',
                createdAt: new Date('03-01-2025'),
            });

            expect(await annotationModel.count({})).toBe(1);
            await annotationModel.create({
                resourceUri: 'uid:/65257776-4e3c-44f6-8652-85502a97e5ac',
                fieldId: null,
                kind: 'comment',
                authorName: 'John DOE',
                authorEmail: 'john.doe@marmelab.com',
                comment: 'This is another comment',
                status: 'to_review',
                internalComment: null,
                createdAt: new Date('02-01-2025'),
            });
            expect(await annotationModel.count({})).toBe(2);
            expect(
                await annotationModel.count({
                    resourceUri: 'uid:/65257776-4e3c-44f6-8652-85502a97e5ac',
                }),
            ).toBe(1);
        });
    });

    describe('findOneById', () => {
        it('should return target annotation', async () => {
            const annotation = await annotationModel.create({
                comment: 'target annotation',
            });
            await annotationModel.create({
                comment: 'another annotation',
            });

            expect(
                await annotationModel.findOneById(annotation._id),
            ).toStrictEqual(annotation);
        });
        it('should return null if target annotation does not exists', async () => {
            await annotationModel.create({
                comment: 'another annotation',
            });

            expect(
                await annotationModel.findOneById('404404404404404404404404'),
            ).toBeNull();
        });
        it('should return null if id is not a valid ObjectId format', async () => {
            await annotationModel.create({
                comment: 'another annotation',
            });

            expect(await annotationModel.findOneById('404')).toBeNull();
        });
    });

    describe('deleteOneById', () => {
        it('should delete an annotation', async () => {
            const annotation = await annotationModel.create({
                comment: 'target annotation',
            });

            expect(await annotationModel.count({})).toBe(1);

            await expect(
                annotationModel.deleteOneById(annotation._id),
            ).resolves.toBe(1);

            expect(await annotationModel.count({})).toBe(0);
        });

        it('should return 0 if target annotation does not exists', async () => {
            await annotationModel.create({
                comment: 'another annotation',
            });

            await expect(
                annotationModel.deleteOneById('404404404404404404404404'),
            ).resolves.toBe(0);

            expect(await annotationModel.count({})).toBe(1);
        });

        it('should return 0 if id is not a valid ObjectId format', async () => {
            await annotationModel.create({
                comment: 'another annotation',
            });

            await expect(annotationModel.deleteOneById('404')).resolves.toBe(0);

            expect(await annotationModel.count({})).toBe(1);
        });
    });

    describe('deleteManyById', () => {
        let firstAnnotation: any, secondAnnotation: any;
        beforeEach(async () => {
            firstAnnotation = await annotationModel.create({
                comment: 'target annotation',
            });
            secondAnnotation = await annotationModel.create({
                comment: 'another annotation',
            });
        });

        it('should delete a list of annotations', async () => {
            expect(await annotationModel.count({})).toBe(2);

            await expect(
                annotationModel.deleteManyById([
                    firstAnnotation._id.toString(),
                ]),
            ).resolves.toBe(1);

            expect(await annotationModel.findLimitFromSkip()).toMatchObject([
                secondAnnotation,
            ]);
        });

        it('should delete a list of annotations', async () => {
            expect(await annotationModel.count({})).toBe(2);

            await expect(
                annotationModel.deleteManyById([
                    firstAnnotation._id.toString(),
                    secondAnnotation._id.toString(),
                ]),
            ).resolves.toBe(2);

            expect(await annotationModel.count({})).toBe(0);
        });

        it('should skip invalid ids', async () => {
            expect(await annotationModel.count({})).toBe(2);

            await expect(
                annotationModel.deleteManyById([
                    '404',
                    secondAnnotation._id.toString(),
                ]),
            ).resolves.toBe(1);

            expect(await annotationModel.findLimitFromSkip()).toMatchObject([
                firstAnnotation,
            ]);
        });
    });

    describe('deleteMany', () => {
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

        it('should delete annotations matching the filter', async () => {
            expect(await annotationModel.count({})).toBe(2);

            await expect(
                annotationModel.deleteMany({
                    comment: new RegExp(`^.*target.*$`, 'gi'),
                }),
            ).resolves.toStrictEqual({
                acknowledged: true,
                deletedCount: 1,
            });

            expect(await annotationModel.findLimitFromSkip({})).toMatchObject([
                {
                    comment: 'another annotation',
                },
            ]);
        });
    });

    describe('findManyByFieldAndResource', () => {
        let annotationList: any;
        beforeEach(async () => {
            annotationList = await Promise.all(
                [
                    {
                        resourceUri:
                            'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
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
                        resourceUri:
                            'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                        fieldId: 'GvaF',
                        kind: 'correct',
                        authorName: 'Developer',
                        authorEmail: 'developer@marmelab.com',
                        comment: 'This is a correction',
                        status: 'to_review',
                        internalComment: null,
                        createdAt: new Date('04-01-2025'),
                    },
                    {
                        resourceUri: '/',
                        fieldId: 'GvaF',
                        kind: 'comment',
                        authorName: 'John DOE',
                        authorEmail: 'john.doe@marmelab.com',
                        comment: 'This is another comment',
                        status: 'to_review',
                        internalComment: null,
                        createdAt: new Date('02-01-2025'),
                    },
                    {
                        resourceUri:
                            'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                        fieldId: 'AvaF',
                        kind: 'correction',
                        authorName: 'Jane SMITH',
                        authorEmail: 'jane.smith@marmelab.com',
                        comment:
                            'The author list is incomplete: it should include Jane SMITH',
                        status: 'rejected',
                        internalComment:
                            'Jane SMITH is not an author of this document',
                        createdAt: new Date('01-01-2025'),
                    },
                    {
                        resourceUri:
                            'uid:/7a8d429f-8134-4502-b9d3-d20c571592fa',
                        fieldId: 'GvaF',
                        kind: 'correction',
                        authorName: 'Jane SMITH',
                        authorEmail: 'jane.smith@marmelab.com',
                        comment:
                            'The author list is incomplete: it should include Jane SMITH',
                        status: 'rejected',
                        internalComment:
                            'Jane SMITH is not an author of this document',
                        createdAt: new Date('01-01-2025'),
                    },
                ].map(annotationModel.create),
            );
        });

        it('should return an array of annotations for given fieldName and resourceUri sorted from newest to oldest (createdAt)', async () => {
            expect(
                await annotationModel.findManyByFieldAndResource(
                    'GvaF',
                    'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                ),
            ).toEqual([annotationList[1], annotationList[0]]);
        });

        it('should return an array of annotations for given fieldName and no resourceUri when resourceUri is /', async () => {
            expect(
                await annotationModel.findManyByFieldAndResource('GvaF', '/'),
            ).toEqual([annotationList[2]]);
        });

        it('should return an empty array when no annotations matches query', async () => {
            expect(
                await annotationModel.findManyByFieldAndResource(
                    'AvaF',
                    'uid:/7a8d429f-8134-4502-b9d3-d20c571592fa',
                ),
            ).toEqual([]);
        });
    });
});
