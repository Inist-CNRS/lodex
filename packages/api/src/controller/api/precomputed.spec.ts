import { TaskStatus } from '@lodex/common';
import asyncBusboy from '@recuperateur/async-busboy';
import fs from 'fs/promises';
import { ObjectId } from 'mongodb';
import type { PreComputation } from '../../models/precomputed';
import type { AppContext } from '../../services/repositoryMiddleware';
import { cancelJob } from '../../workers/tools';
import {
    cancelPrecomputedJob,
    deletePrecomputed,
    getPrecomputedResultColumns,
    getPrecomputedResultList,
    postImportPrecomputedResult,
    postPrecomputed,
    putPrecomputed,
} from './precomputed';

const mockedAsyncBusboy = asyncBusboy as jest.MockedFunction<
    typeof asyncBusboy
>;

jest.mock('../../workers/tools', () => ({
    getActiveJob: jest.fn(),
    cancelJob: jest.fn(),
}));

jest.mock('@recuperateur/async-busboy', () => {
    return jest.fn();
});

jest.mock('fs/promises', () => ({
    readFile: jest.fn(),
    unlink: jest.fn(),
}));

describe('Precomputed controller', () => {
    describe('postPrecomputed', () => {
        it('should call precomputed create repository method', async () => {
            const ctx = {
                configTenant: {},
                request: { body: { name: 'test' } },
                precomputed: { create: jest.fn() },
            } as unknown as AppContext<any, any>;

            await postPrecomputed(ctx);

            expect(ctx.precomputed.create).toHaveBeenCalledWith({
                name: 'test',
            });
        });

        it('should return result as body result', async () => {
            const ctx = {
                configTenant: {},
                request: { body: { name: 'test' } },
                precomputed: {
                    create: jest.fn(() => {
                        return { name: 'test' };
                    }),
                },
            } as unknown as AppContext<any, any>;

            await postPrecomputed(ctx);

            expect(ctx.body).toStrictEqual({
                name: 'test',
            });
        });

        it("should set status 403 if there's not result", async () => {
            const ctx = {
                configTenant: {},
                request: { body: 'my precomputed' },
                precomputed: {
                    create: jest.fn(() => null),
                },
            } as unknown as AppContext<
                PreComputation,
                PreComputation | { error: string }
            >;

            await postPrecomputed(ctx);

            expect(ctx.status).toBe(403);
        });
    });

    describe('putPrecomputed', () => {
        it('should delete existing dataset data based on the precomputed name and update it', async () => {
            const ctx = {
                configTenant: {},
                request: { body: 'my updated precomputed' },
                precomputed: {
                    findOneById: jest.fn(() =>
                        Promise.resolve({ name: 'NAME' }),
                    ),
                    update: jest.fn(() =>
                        Promise.resolve('updated precomputed'),
                    ),
                },
                dataSource: { removeAttribute: jest.fn() },
            } as unknown as AppContext<any, any>;

            const objectId = new ObjectId().toString();
            await putPrecomputed(ctx, objectId);

            expect(ctx.precomputed.update).toHaveBeenCalledWith(
                objectId,
                'my updated precomputed',
            );
            expect(ctx.body).toBe('updated precomputed');
            return;
        });

        it('should return a 403 on error if an error occured', async () => {
            const ctx = {
                configTenant: {},
                request: { body: 'my updated precomputed' },
                precomputed: {
                    update: async () => {
                        throw new Error('ERROR!');
                    },
                },
            } as unknown as AppContext<any, any>;

            await putPrecomputed(ctx, 42 as unknown as string);

            expect(ctx.status).toBe(403);
            expect(ctx.body).toEqual({ error: 'ERROR!' });
        });
    });

    describe('deletePrecomputed', () => {
        it('should return a 403 on error if an error occured', async () => {
            const ctx = {
                configTenant: {},
                precomputed: {
                    delete: async () => {
                        throw new Error('ERROR!');
                    },
                    findOneById: async () => ({ name: 'NAME' }),
                },
            } as unknown as AppContext<void, any>;

            await deletePrecomputed(ctx, '42');

            expect(ctx.status).toBe(403);
            expect(ctx.body).toEqual({ error: 'ERROR!' });
        });
    });

    describe('cancelPrecomputed', () => {
        it('should cancel job and set precomputed status to CANCELED', async () => {
            const ctx = {
                configTenant: {},
                precomputed: {
                    findOneById: jest.fn(() =>
                        Promise.resolve({ name: 'PRECOMPUTED_NAME' }),
                    ),
                    updateStatus: jest.fn(),
                },
            } as unknown as AppContext<any, any>;

            const precomputedId = new ObjectId().toString();
            await cancelPrecomputedJob(ctx, precomputedId);

            expect(cancelJob).toHaveBeenCalledWith(
                ctx,
                'precomputer',
                'PRECOMPUTED_NAME',
            );
            expect(ctx.precomputed.updateStatus).toHaveBeenCalledWith(
                precomputedId,
                TaskStatus.CANCELED,
                {},
            );
            expect(ctx.status).toBe(200);
            expect(ctx.body).toEqual({ message: 'Job cancelled' });
        });
        it('should return 404 if precomputed not found', async () => {
            const ctx = {
                configTenant: {},
                precomputed: {
                    findOneById: jest.fn(() => Promise.resolve(null)),
                    updateStatus: jest.fn(),
                },
            } as unknown as AppContext<any, any>;

            const precomputedId = new ObjectId().toString();
            await cancelPrecomputedJob(ctx, precomputedId);

            expect(ctx.status).toBe(404);
            expect(ctx.body).toEqual({ message: 'Precomputed not found' });
        });
    });

    describe('getPrecomputedResultList', () => {
        it('should return a list of results from precomputed repository', async () => {
            const ctx = {
                configTenant: {},
                query: {
                    limit: '10',
                    skip: '0',
                    sortBy: 'field1',
                    sortDir: 'ASC',
                },
                precomputed: {
                    resultFindLimitFromSkip: jest.fn(() =>
                        Promise.resolve([{ field1: 'value1' }]),
                    ),
                    resultCount: jest.fn(() => Promise.resolve(1)),
                },
            } as unknown as AppContext<any, any>;

            const precomputedId = new ObjectId().toString();
            await getPrecomputedResultList(ctx, precomputedId);

            expect(
                ctx.precomputed.resultFindLimitFromSkip,
            ).toHaveBeenCalledWith({
                precomputedId,
                limit: 10,
                skip: 0,
                query: {},
                sortBy: 'field1',
                sortDir: 'ASC',
            });
            expect(ctx.precomputed.resultCount).toHaveBeenCalledWith(
                precomputedId,
                {},
            );
            expect(ctx.body).toEqual({
                count: 1,
                datas: [{ field1: 'value1' }],
            });
        });
    });

    describe('getPrecomputedResultColumns', () => {
        it('should return result columns from precomputed repository', async () => {
            const ctx = {
                configTenant: {},
                precomputed: {
                    getResultColumns: jest.fn(() =>
                        Promise.resolve(['column1', 'column2']),
                    ),
                },
            } as unknown as AppContext<any, any>;

            const precomputedId = new ObjectId().toString();
            await getPrecomputedResultColumns(ctx, precomputedId);

            expect(ctx.precomputed.getResultColumns).toHaveBeenCalledWith(
                precomputedId,
            );
            expect(ctx.body).toEqual({
                columns: ['column1', 'column2'],
            });
        });
    });

    describe('postImportPrecomputedResult', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should return 400 if no body is provided', async () => {
            // Mock asyncBusboy to throw an error for malformed multipart data
            mockedAsyncBusboy.mockRejectedValue(
                new Error('Multipart: Boundary not found'),
            );

            const ctx = {
                configTenant: {},
                req: {
                    headers: {
                        'content-type': 'multipart/form-data',
                    },
                },
            } as unknown as AppContext<any, any>;

            const precomputedId = new ObjectId().toString();
            await postImportPrecomputedResult(ctx, precomputedId);

            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({
                message: 'Multipart: Boundary not found',
            });
        });

        it('should return 400 if more than one file is provided', async () => {
            // Mock asyncBusboy to return multiple files
            mockedAsyncBusboy.mockResolvedValue({
                files: [
                    { filename: 'file1.json', path: '/tmp/file1' },
                    { filename: 'file2.json', path: '/tmp/file2' },
                ],
                fields: {},
            });

            const ctx = {
                configTenant: {},
                req: {
                    headers: {
                        'content-type':
                            'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
                    },
                },
            } as unknown as AppContext<any, any>;

            const precomputedId = new ObjectId().toString();
            await postImportPrecomputedResult(ctx, precomputedId);

            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({
                message: 'Only one file must be provided',
            });
        });

        it('should save the file in db', async () => {
            // Mock asyncBusboy to return a single file
            mockedAsyncBusboy.mockResolvedValue({
                files: [{ filename: 'file1.json', path: '/tmp/file1' }],
                fields: {},
            });

            fs.readFile = jest.fn().mockResolvedValue(
                JSON.stringify([
                    { resultField1: 'value1', resultField2: 'valueA' },
                    { resultField1: 'value2', resultField2: 'valueA' },
                ]),
            );

            const ctx = {
                configTenant: {},
                req: {
                    headers: {
                        'content-type':
                            'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
                    },
                },
                precomputed: {
                    insertManyResults: jest.fn().mockResolvedValue(undefined),
                    deleteManyResults: jest.fn().mockResolvedValue(undefined),
                    updateStatus: jest.fn().mockResolvedValue(undefined),
                },
            } as unknown as AppContext<any, any>;

            const precomputedId = new ObjectId().toString();
            await postImportPrecomputedResult(ctx, precomputedId);

            expect(ctx.body).toEqual({
                message: 'Imported',
            });

            expect(ctx.precomputed.deleteManyResults).toHaveBeenCalledWith({
                precomputedId,
            });

            expect(ctx.precomputed.insertManyResults).toHaveBeenCalledWith(
                precomputedId,
                [
                    { resultField1: 'value1', resultField2: 'valueA' },
                    { resultField1: 'value2', resultField2: 'valueA' },
                ],
            );

            expect(ctx.precomputed.updateStatus).toHaveBeenCalledWith(
                precomputedId,
                TaskStatus.FINISHED,
                {
                    hasData: true,
                },
            );
        });
    });
});
