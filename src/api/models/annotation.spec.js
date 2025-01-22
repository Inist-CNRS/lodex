import { ObjectId } from 'mongodb';
import { default as annotationFactory } from './annotation';

const listCollections = {
    toArray: () => [true],
};

const NOW = new Date();
const ANNOTATIONS = [
    {
        resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
        itemPath: ['GvaF'],
        kind: 'comment',
        authorName: 'Developer',
        authorEmail: 'developer@marmelab.com',
        comment: 'This is a comment',
        status: 'in_progress',
        internal_comment: 'This is an internal comment',
    },
    {
        resourceUri: 'uid:/65257776-4e3c-44f6-8652-85502a97e5ac',
        itemPath: null,
        kind: 'comment',
        authorName: 'John DOE',
        authorEmail: 'john.doe@marmelab.com',
        comment: 'This is another comment',
        status: 'to_review',
        internal_comment: null,
    },
    {
        resourceUri: 'uid:/d4f1e376-d5dd-4853-b515-b7f63b34d67d',
        itemPath: null,
        kind: 'correction',
        authorName: 'Jane SMITH',
        authorEmail: 'jane.smith@marmelab.com',
        comment: 'The author list is incomplete: it should include Jane SMITH',
        status: 'rejected',
        internal_comment: 'Jane SMITH is not an author of this document',
    },
];

describe('annotation', () => {
    let db;
    let annotationList;
    let annotationCollection;
    let annotationModel;

    beforeEach(async () => {
        annotationList = structuredClone(ANNOTATIONS).map((annotation) => ({
            ...annotation,
            _id: new ObjectId(),
            createdAt: NOW,
            updatedAt: NOW,
        }));

        annotationCollection = {
            createIndex: jest.fn(),
            findOne: jest.fn().mockImplementation(({ _id }) => {
                return Promise.resolve(
                    annotationList.find((annotation) =>
                        annotation._id.equals(_id),
                    ) ?? null,
                );
            }),
            insertOne: jest.fn().mockImplementation((payload) => {
                const annotation = {
                    ...payload,
                    _id: new ObjectId(),
                };
                annotationList.push(annotation);
                return Promise.resolve({
                    acknowledged: true,
                    insertedId: annotation._id,
                });
            }),
            updateOne: jest.fn(),
            updateMany: jest.fn(),
            find: jest.fn().mockImplementation(() => ({
                sort: () => ({
                    skip: (skip) => ({
                        limit: (limit) => ({
                            toArray: () =>
                                Promise.resolve(
                                    annotationList.slice(skip, skip + limit),
                                ),
                        }),
                    }),
                }),
            })),
            findOneAndUpdate: jest
                .fn()
                .mockImplementation(() => Promise.resolve('result')),
            countDocuments: jest
                .fn()
                .mockImplementation(() =>
                    Promise.resolve(annotationList.length),
                ),
        };

        db = {
            collection: jest
                .fn()
                .mockImplementation(() => annotationCollection),
            listCollections: () => listCollections,
        };

        annotationModel = await annotationFactory(db);

        annotationCollection.insertOne.mockClear();
        annotationCollection.find.mockClear();
    });

    describe('create', () => {
        it('should create a new annotation', async () => {
            const annotation = {
                resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                itemPath: ['Gb4a'],
                kind: 'comment',
                authorName: 'Rick HARRIS',
                authorEmail: 'rick.harris@marmelab.com',
                comment: 'Hello world',
            };

            const result = await annotationModel.create(annotation);
            expect(result).toMatchObject(annotation);

            expect(result._id).toBeDefined();
            expect(result.status).toBe('to_review');
            expect(result.internal_comment).toBeNull();
            expect(result.createdAt).toBeDefined();
            expect(result.updatedAt).toBeDefined();

            expect(NOW - result.createdAt).toBeLessThan(0);
            expect(NOW - result.updatedAt).toBeLessThan(0);

            expect(annotationList).toHaveLength(4);
            expect(annotationList[3]).toStrictEqual(result);
        });
    });

    describe('findLimitFromSkip', () => {
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
            const count = await annotationModel.count({
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
            });

            expect(count).toBe(3);
        });
    });
});
