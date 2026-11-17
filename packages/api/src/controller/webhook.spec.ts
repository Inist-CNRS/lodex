import { getComputedWebserviceData } from './webhook';
import { getAskForPrecomputedJobId } from '../services/precomputed/precomputed';
import {
    getPrecomputedCollectionForWebHook,
    getTenantCollection,
} from '../services/repositoryMiddleware';
import { getOrCreateWorkerQueue } from '../workers';

jest.mock('../services/repositoryMiddleware', () => ({
    getPrecomputedCollectionForWebHook: jest.fn(),
    getTenantCollection: jest.fn(),
}));
jest.mock('../services/mongoClient', () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue('adminDb'),
}));
jest.mock('../workers', () => ({
    getOrCreateWorkerQueue: jest.fn(),
}));
jest.mock('../services/logger', () => ({
    __esModule: true,
    default: () => ({ error: jest.fn(), warn: jest.fn(), info: jest.fn() }),
}));
jest.mock('../workers/precomputer', () => ({
    PRECOMPUTER: 'precomputer',
}));

describe('webhook controller', () => {
    describe('getComputedWebserviceData', () => {
        const markAnswered = jest.fn();
        const add = jest.fn();
        const findOneByName = jest.fn();
        const callOrder: string[] = [];

        beforeEach(() => {
            jest.clearAllMocks();
            callOrder.length = 0;
            markAnswered.mockImplementation(async () => {
                callOrder.push('markAnswered');
            });
            add.mockImplementation(async () => {
                callOrder.push('add');
            });
            (getPrecomputedCollectionForWebHook as jest.Mock).mockResolvedValue(
                { markAnswered },
            );
            (getOrCreateWorkerQueue as jest.Mock).mockReturnValue({ add });
            findOneByName.mockImplementation(async (name: string) =>
                name === 'lodex' ? { name } : null,
            );
            (getTenantCollection as jest.Mock).mockResolvedValue({
                findOneByName,
            });
        });

        it.each([
            ['an unknown tenant', 'nope'],
            ['no tenant', undefined],
            ['a list of tenants', ['lodex']],
        ])('should ignore %s', async (_name, tenant) => {
            const ctx: any = {
                request: {
                    query: {
                        precomputedId: 'pid',
                        tenant,
                        jobId: 'lodex-precomputed-job-run-1',
                    },
                    body: { identifier: 'i', generator: 'g', state: 's' },
                },
            };

            await getComputedWebserviceData(ctx);

            expect(ctx.status).toBe(404);
            expect(getPrecomputedCollectionForWebHook).not.toHaveBeenCalled();
            expect(getOrCreateWorkerQueue).not.toHaveBeenCalled();
        });

        it('should mark the precomputation as answered then queue the job', async () => {
            const ctx: any = {
                request: {
                    query: {
                        precomputedId: 'pid',
                        tenant: 'lodex',
                        jobId: 'lodex-precomputed-job-run-1',
                    },
                    body: { identifier: 'i', generator: 'g', state: 's' },
                },
            };

            await getComputedWebserviceData(ctx);

            expect(getPrecomputedCollectionForWebHook).toHaveBeenCalledWith(
                'lodex',
            );
            expect(markAnswered).toHaveBeenCalledWith('pid', 'run-1');
            expect(add).toHaveBeenCalledWith(
                'precomputer',
                expect.objectContaining({
                    id: 'pid',
                    action: 'getPrecomputed',
                    tenant: 'lodex',
                }),
                expect.any(Object),
            );
            expect(callOrder).toEqual(['markAnswered', 'add']);
            expect(ctx.status).toBe(200);
        });

        it('should also mark it answered on failure', async () => {
            const ctx: any = {
                request: {
                    query: {
                        precomputedId: 'pid',
                        tenant: 'lodex',
                        jobId: 'lodex-precomputed-job-run-1',
                        failure: 'true',
                    },
                    body: {
                        error: { type: 't', message: 'm' },
                    },
                },
            };

            await getComputedWebserviceData(ctx);

            expect(markAnswered).toHaveBeenCalledWith('pid', 'run-1');
            expect(add).toHaveBeenCalledWith(
                'precomputer',
                expect.objectContaining({ error: { type: 't', message: 'm' } }),
                expect.any(Object),
            );
        });

        it('should still queue the job when markAnswered fails', async () => {
            markAnswered.mockRejectedValue(new Error('boom'));
            const ctx: any = {
                request: {
                    query: {
                        precomputedId: 'pid',
                        tenant: 'lodex',
                        jobId: 'lodex-precomputed-job-run-1',
                    },
                    body: { identifier: 'i', generator: 'g', state: 's' },
                },
            };

            await getComputedWebserviceData(ctx);

            expect(add).toHaveBeenCalledTimes(1);
            expect(ctx.status).toBe(200);
        });
    });
    describe('getAskForPrecomputedJobId', () => {
        it('should read the job id from the room', () => {
            expect(
                getAskForPrecomputedJobId(
                    'lodex',
                    'lodex-precomputed-job-0a51-4b2c',
                ),
            ).toBe('0a51-4b2c');
        });

        it.each([
            ['another tenant', 'other-precomputed-job-run-1'],
            ['no job id', 'lodex-precomputed-job-'],
            ['no room', undefined],
            ['a list', ['lodex-precomputed-job-run-1']],
        ])('should give nothing for %s', (_name, room) => {
            expect(getAskForPrecomputedJobId('lodex', room)).toBeUndefined();
        });
    });
});
