const { ObjectId } = require('mongodb');
const { createAnnotation, getAnnotations } = require('./annotation');

const NOW = new Date();
const ANNOTATIONS = [
    {
        resourceId: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
        itemPath: ['GvaF'],
        authorName: 'Developer',
        authorEmail: 'developer@marmelab.com',
        comment: 'This is a comment',
        status: 'in_progress',
        internal_comment: 'This is an internal comment',
    },
    {
        resourceId: 'uid:/65257776-4e3c-44f6-8652-85502a97e5ac',
        itemPath: null,
        authorName: 'John DOE',
        authorEmail: 'john.doe@marmelab.com',
        comment: 'This is another comment',
        status: 'to_review',
        internal_comment: null,
    },
    {
        resourceId: 'uid:/d4f1e376-d5dd-4853-b515-b7f63b34d67d',
        itemPath: null,
        authorName: 'Jane SMITH',
        authorEmail: 'jane.smith@marmelab.com',
        comment: 'The author list is incomplete: it should include Jane SMITH',
        status: 'rejected',
        internal_comment: 'Jane SMITH is not an author of this document',
    },
];

describe('annotation', () => {
    let annotationList;
    let annotationModel;

    beforeEach(async () => {
        annotationList = structuredClone(ANNOTATIONS).map((annotation) => ({
            ...annotation,
            _id: new ObjectId(),
            createdAt: NOW,
            updatedAt: NOW,
        }));

        annotationModel = {
            create: jest.fn().mockImplementation((payload) => {
                const now = new Date();
                const createdAnnotation = {
                    ...payload,
                    _id: new ObjectId(),
                    status: 'to_review',
                    internal_comment: null,
                    createdAt: now,
                    updatedAt: now,
                };
                annotationList.push(createdAnnotation);
                return Promise.resolve(createdAnnotation);
            }),
            findLimitFromSkip: jest
                .fn()
                .mockImplementation(({ skip, limit }) => {
                    return Promise.resolve(
                        annotationList.slice(skip, skip + limit),
                    );
                }),
            count: jest.fn().mockImplementation(() => {
                return Promise.resolve(annotationList.length);
            }),
        };
    });

    describe('createAnnotation', () => {
        it('should create an annotation', async () => {
            const annotation = {
                resourceId: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                itemPath: ['Gb4a'],
                comment: 'Hello world',
            };

            const ctx = {
                request: {
                    body: annotation,
                },
                response: {},
                annotation: annotationModel,
            };

            await createAnnotation(ctx);

            expect(ctx.annotation.create).toHaveBeenCalledWith(annotation);

            expect(ctx.response.status).toBe(200);
            expect(ctx.body).toMatchObject({
                total: 1,
                data: {
                    ...annotation,
                    status: 'to_review',
                    internal_comment: null,
                },
            });
        });

        it('should return an error if annotation is not valid', async () => {
            const annotation = {
                resourceId: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                comment: '',
            };

            const ctx = {
                request: {
                    body: annotation,
                },
                response: {},
                annotation: annotationModel,
            };

            await createAnnotation(ctx);

            expect(ctx.annotation.create).not.toHaveBeenCalled();

            expect(ctx.response.status).toBe(400);
            expect(ctx.body).toMatchObject({
                total: 0,
                errors: [
                    {
                        path: ['comment'],
                        message: 'annotation_comment_min_length',
                    },
                ],
            });
        });
    });

    describe('getAnnotations', () => {
        it('should list annotations', async () => {
            const ctx = {
                request: {
                    query: {},
                },
                response: {},
                annotation: annotationModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);
            expect(ctx.body).toMatchObject({
                total: 3,
                fullTotal: 3,
                data: annotationList,
            });

            expect(ctx.annotation.findLimitFromSkip).toHaveBeenCalledWith({
                limit: 10,
                skip: 0,
                query: {},
                sortBy: 'createdAt',
                sortDir: 'DESC',
            });

            expect(ctx.annotation.count).toHaveBeenCalledWith({});
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
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);
            expect(ctx.body).toMatchObject({
                total: 1,
                fullTotal: 3,
                data: [annotationList[2]],
            });

            expect(ctx.annotation.findLimitFromSkip).toHaveBeenCalledWith({
                limit: 2,
                skip: 2,
                query: {},
                sortBy: 'createdAt',
                sortDir: 'DESC',
            });

            expect(ctx.annotation.count).toHaveBeenCalledWith({});
        });

        it('should apply filters', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 1,
                        perPage: 2,
                        match: {
                            resourceId: 'test',
                        },
                    },
                },
                response: {},
                annotation: annotationModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.annotation.findLimitFromSkip).toHaveBeenCalledWith({
                limit: 2,
                skip: 2,
                query: {
                    resourceId: 'test',
                },
                sortBy: 'createdAt',
                sortDir: 'DESC',
            });

            expect(ctx.annotation.count).toHaveBeenCalledWith({
                resourceId: 'test',
            });
        });

        it('should order results', async () => {
            const ctx = {
                request: {
                    query: {
                        sortBy: 'resourceId',
                        sortDir: 'ASC',
                    },
                },
                response: {},
                annotation: annotationModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(200);

            expect(ctx.annotation.findLimitFromSkip).toHaveBeenCalledWith({
                limit: 10,
                skip: 0,
                query: {},
                sortBy: 'resourceId',
                sortDir: 'ASC',
            });

            expect(ctx.annotation.count).toHaveBeenCalledWith({});
        });

        it('should return an error if query is not valid', async () => {
            const ctx = {
                request: {
                    query: {
                        page: 1,
                        perPage: 2,
                        match: {
                            comment: 'test',
                        },
                    },
                },
                response: {},
                annotation: annotationModel,
            };

            await getAnnotations(ctx);

            expect(ctx.response.status).toBe(400);
            expect(ctx.body).toMatchObject({
                total: 0,
                fullTotal: 0,
                errors: [
                    {
                        message: 'annotation_query_match_invalid_key',
                        path: ['match', 'comment'],
                    },
                ],
                data: [],
            });

            expect(ctx.annotation.findLimitFromSkip).not.toHaveBeenCalled();

            expect(ctx.annotation.count).not.toHaveBeenCalled();
        });
    });
});
