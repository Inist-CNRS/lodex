import { MongoClient, ObjectId } from 'mongodb';
import createAnnotationModel from './annotation';

describe('annotation', () => {
    const connectionStringURI = process.env.MONGO_URL;
    let db;
    let connection;
    let annotationModel;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
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
                itemPath: [],
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
    });

    describe('updateOneById', () => {
        it('should update target annotation', async () => {
            const date = new Date();
            const annotation = await annotationModel.create({
                resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                itemPath: [],
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

    describe('findLimitFromSkip', () => {
        let annotationList;
        beforeEach(async () => {
            annotationList = await Promise.all(
                [
                    {
                        resourceUri:
                            'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                        fieldId: 'GvaF',
                        itemPath: [],
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
                        itemPath: null,
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
                        itemPath: null,
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
                itemPath: [],
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
                itemPath: null,
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
});
