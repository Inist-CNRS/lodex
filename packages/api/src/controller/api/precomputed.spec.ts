import { ObjectId } from 'mongodb';
import {
    postPrecomputed,
    putPrecomputed,
    deletePrecomputed,
    getPrecomputedResultList,
    getPrecomputedResultColumns,
} from './precomputed';
import type { AppContext } from '../../services/repositoryMiddleware';
import type { PreComputation } from '../../models/precomputed';

jest.mock('../../workers/tools', () => ({
    getActiveJob: jest.fn(),
    cancelJob: jest.fn(),
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
                dataset: { removeAttribute: jest.fn() },
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
});
