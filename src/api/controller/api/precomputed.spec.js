import {
    postPrecomputed,
    putPrecomputed,
    deletePrecomputed,
} from './precomputed';

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
            };

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
            };

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
            };

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
            };

            await putPrecomputed(ctx, 42);

            expect(ctx.precomputed.update).toHaveBeenCalledWith(
                42,
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
            };

            await putPrecomputed(ctx, 42);

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
            };

            await deletePrecomputed(ctx, 42);

            expect(ctx.status).toBe(403);
            expect(ctx.body).toEqual({ error: 'ERROR!' });
        });
    });
});
