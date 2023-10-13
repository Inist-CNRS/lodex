import {
    postPrecomputed,
    putPrecomputed,
    deletePrecomputed,
} from './precomputed';
import { getActiveJob, cancelJob } from '../../workers/tools';

jest.mock('../../workers/tools', () => ({
    getActiveJob: jest.fn(),
    cancelJob: jest.fn(),
}));

describe('Precomputed controller', () => {
    describe('postPrecomputed', () => {
        it('should call precomputed create repository method', async () => {
            const ctx = {
                request: { body: { name: 'test' } },
                precomputed: { create: jest.fn() },
            };

            await postPrecomputed(ctx);

            expect(ctx.precomputed.create).toHaveBeenCalledWith({
                name: 'test',
            });
        });

        it('should return result as body result', async () => {
            const ctx = {
                request: { body: { name: 'test' } },
                precomputed: {
                    create: jest.fn(() => {
                        return { name: 'test' };
                    }),
                },
            };

            await postPrecomputed(ctx);

            expect(ctx.body).toStrictEqual({
                name: 'test',
            });
        });

        it("should set status 403 if there's not result", async () => {
            const ctx = {
                request: { body: 'my precomputed' },
                precomputed: {
                    create: jest.fn(() => null),
                },
            };

            await postPrecomputed(ctx);

            expect(ctx.status).toBe(403);
        });
    });

    describe('putPrecomputed', () => {
        it('should delete existing dataset data based on the precomputed name and update it', async () => {
            const ctx = {
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
            };

            await putPrecomputed(ctx, 42);

            expect(ctx.precomputed.findOneById).toHaveBeenCalledWith(42);
            expect(ctx.dataset.removeAttribute).toHaveBeenCalledWith('NAME');
            expect(ctx.precomputed.update).toHaveBeenCalledWith(
                42,
                'my updated precomputed',
            );
            expect(ctx.body).toEqual('updated precomputed');
            return;
        });

        it('should return a 403 on error if an error occured', async () => {
            const ctx = {
                request: { body: 'my updated precomputed' },
                precomputed: {
                    findOneById: async () => {
                        throw new Error('ERROR!');
                    },
                },
            };

            await putPrecomputed(ctx, 42);

            expect(ctx.status).toBe(403);
            expect(ctx.body).toEqual({ error: 'ERROR!' });
        });
    });

    describe('deletePrecomputed', () => {
        it('should delete existing dataset data based on the precomputed name and then delete it', async () => {
            const ctx = {
                precomputed: {
                    findOneById: jest.fn(() => ({ name: 'NAME' })),
                    delete: jest.fn(),
                },
                dataset: { removeAttribute: jest.fn() },
            };
            getActiveJob.mockResolvedValue({
                data: { id: 42, jobType: 'precomputer' },
            });

            await deletePrecomputed(ctx, 42);

            expect(ctx.precomputed.findOneById).toHaveBeenCalledWith(42);
            expect(ctx.dataset.removeAttribute).toHaveBeenCalledWith('NAME');
            expect(ctx.precomputed.delete).toHaveBeenCalledWith(42);
            expect(cancelJob).toHaveBeenCalled();
            expect(ctx.status).toBe(200);
        });

        it('should return a 403 on error if an error occured', async () => {
            const ctx = {
                precomputed: {
                    findOneById: async () => {
                        throw new Error('ERROR!');
                    },
                    delete: jest.fn(),
                },
                dataset: { removeAttribute: jest.fn() },
            };

            await deletePrecomputed(ctx, 42);

            expect(ctx.status).toBe(403);
            expect(ctx.body).toEqual({ error: 'ERROR!' });
        });
    });
});
