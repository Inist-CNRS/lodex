import { postEnrichment, putEnrichment, deleteEnrichment } from './enrichment';
import { getActiveJob, cancelJob } from '../../workers/tools';

jest.mock('../../workers/tools', () => ({
    getActiveJob: jest.fn(),
    cancelJob: jest.fn(),
}));

describe('Enrichment controller', () => {
    describe('postEnrichment', () => {
        it('should call enrichment create repository method', async () => {
            const ctx = {
                request: { body: { advancedMode: true, name: 'test' } },
                enrichment: { create: jest.fn() },
                configTenant: {},
            };

            await postEnrichment(ctx);

            expect(ctx.enrichment.create).toHaveBeenCalledWith({
                advancedMode: true,
                name: 'test',
            });
        });

        it('should return result as body result', async () => {
            const ctx = {
                request: { body: { advancedMode: true, name: 'test' } },
                enrichment: {
                    create: jest.fn(() => {
                        return { advancedMode: true, name: 'test' };
                    }),
                },
                configTenant: {},
            };

            await postEnrichment(ctx);

            expect(ctx.body).toStrictEqual({
                advancedMode: true,
                name: 'test',
            });
        });

        it("should set status 403 if there's not result", async () => {
            const ctx = {
                request: { body: 'my enrichment' },
                enrichment: {
                    create: jest.fn(() => null),
                },
                configTenant: {},
            };

            await postEnrichment(ctx);

            expect(ctx.status).toBe(403);
        });
    });

    describe('putEnrichment', () => {
        it('should delete existing dataset data based on the enrichment name and update it', async () => {
            const ctx = {
                request: { body: 'my updated enrichment' },
                enrichment: {
                    findOneById: jest.fn(() =>
                        Promise.resolve({ name: 'NAME' }),
                    ),
                    update: jest.fn(() =>
                        Promise.resolve('updated enrichment'),
                    ),
                },
                dataset: { removeAttribute: jest.fn() },
                configTenant: {},
            };

            await putEnrichment(ctx, 42);

            expect(ctx.enrichment.findOneById).toHaveBeenCalledWith(42);
            expect(ctx.dataset.removeAttribute).toHaveBeenCalledWith('NAME');
            expect(ctx.enrichment.update).toHaveBeenCalledWith(
                42,
                'my updated enrichment',
            );
            expect(ctx.body).toEqual('updated enrichment');
            return;
        });

        it('should return a 403 on error if an error occured', async () => {
            const ctx = {
                request: { body: 'my updated enrichment' },
                enrichment: {
                    findOneById: async () => {
                        throw new Error('ERROR!');
                    },
                },
                configTenant: {},
            };

            await putEnrichment(ctx, 42);

            expect(ctx.status).toBe(403);
            expect(ctx.body).toEqual({ error: 'ERROR!' });
        });
    });

    describe('deleteEnrichment', () => {
        it('should delete existing dataset data based on the enrichment name and then delete it', async () => {
            const ctx = {
                enrichment: {
                    findOneById: jest.fn(() => ({ name: 'NAME' })),
                    delete: jest.fn(),
                },
                dataset: { removeAttribute: jest.fn() },
                configTenant: {},
            };
            getActiveJob.mockResolvedValue({
                data: { id: 42, jobType: 'enricher' },
            });

            await deleteEnrichment(ctx, 42);

            expect(ctx.enrichment.findOneById).toHaveBeenCalledWith(42);
            expect(ctx.dataset.removeAttribute).toHaveBeenCalledWith('NAME');
            expect(ctx.enrichment.delete).toHaveBeenCalledWith(42);
            expect(cancelJob).toHaveBeenCalled();
            expect(ctx.status).toBe(200);
        });

        it('should return a 403 on error if an error occured', async () => {
            const ctx = {
                enrichment: {
                    findOneById: async () => {
                        throw new Error('ERROR!');
                    },
                    delete: jest.fn(),
                },
                dataset: { removeAttribute: jest.fn() },
                configTenant: {},
            };

            await deleteEnrichment(ctx, 42);

            expect(ctx.status).toBe(403);
            expect(ctx.body).toEqual({ error: 'ERROR!' });
        });
    });
});
