import { TaskStatus } from '@lodex/common';
import {
    getComputedFromWebservice,
    getFailureFromWebservice,
    getPrecomputedDataPreview,
    isSupersededAnswer,
} from './precomputed';

describe('precomputed', () => {
    describe('getPrecomputedDataPreview', () => {
        it('single value', async () => {
            // GIVEN
            const ctx = {
                configTenant: {},
                request: {
                    body: {
                        sourceColumns: ['simpleValue'],
                    },
                },
                dataset: {
                    getExcerpt: () => {
                        return [
                            { uri: '1', simpleValue: 'plop' },
                            { uri: '2', simpleValue: 'plip' },
                            { uri: '3', simpleValue: 'ploup' },
                        ];
                    },
                },
            };

            // WHEN
            const results = await getPrecomputedDataPreview(ctx);

            // THEN
            expect(results).toEqual(
                expect.arrayContaining([
                    { simpleValue: 'plop' },
                    { simpleValue: 'plip' },
                    { simpleValue: 'ploup' },
                ]),
            );
        });

        it('complex values', async () => {
            // GIVEN
            const ctx = {
                configTenant: {},
                request: {
                    body: {
                        sourceColumns: ['arrayValue'],
                    },
                },
                dataset: {
                    getExcerpt: () => {
                        return [
                            { uri: '1', arrayValue: ['plop', 'plup'] },
                            { uri: '2', arrayValue: ['plip'] },
                            { uri: '3', arrayValue: ['ploup'] },
                        ];
                    },
                },
            };

            // WHEN
            const results = await getPrecomputedDataPreview(ctx);

            // THEN
            expect(results).toEqual(
                expect.arrayContaining([
                    { arrayValue: ['plop', 'plup'] },
                    { arrayValue: ['plip'] },
                    { arrayValue: ['ploup'] },
                ]),
            );
        });

        it('multiple values', async () => {
            // GIVEN
            const ctx = {
                configTenant: {},
                request: {
                    body: {
                        sourceColumns: ['lol', 'simpleValue'],
                    },
                },
                dataset: {
                    getExcerpt: () => {
                        return [
                            { uri: '1', lol: 'a', simpleValue: 'plop' },
                            { uri: '2', lol: 'b', simpleValue: 'plip' },
                            { uri: '3', lol: 'c', simpleValue: 'ploup' },
                        ];
                    },
                },
            };

            // WHEN
            const results = await getPrecomputedDataPreview(ctx);

            // THEN
            expect(results).toEqual(
                expect.arrayContaining([
                    { lol: 'a', simpleValue: 'plop' },
                    { lol: 'b', simpleValue: 'plip' },
                    { lol: 'c', simpleValue: 'ploup' },
                ]),
            );
        });
    });

    describe('isSupersededAnswer', () => {
        const room = 'lodex-precomputed-job-run-1';

        it('is false for the answer of the current run', () => {
            expect(isSupersededAnswer('lodex', { jobId: 'run-1' }, room)).toBe(
                false,
            );
        });

        it('is true for the answer of a run relaunched since', () => {
            expect(isSupersededAnswer('lodex', { jobId: 'run-2' }, room)).toBe(
                true,
            );
        });

        it.each([
            ['a precomputation without jobId', {}, room],
            ['a precomputation with a null jobId', { jobId: null }, room],
            ['a room without jobId', { jobId: 'run-2' }, undefined],
        ])('is false for %s', (_name, precomputed, answerRoom) => {
            expect(isSupersededAnswer('lodex', precomputed, answerRoom)).toBe(
                false,
            );
        });
    });

    describe('answers of a superseded run', () => {
        const createCtx = (data: object) => ({
            tenant: 'lodex',
            job: {
                data: {
                    id: 'pid',
                    callId: 'call',
                    askForPrecomputedJobId: 'lodex-precomputed-job-run-1',
                    ...data,
                },
            },
            precomputed: {
                findOneById: jest.fn().mockResolvedValue({
                    _id: 'pid',
                    status: TaskStatus.PENDING,
                    jobId: 'run-2',
                }),
                updateStatus: jest.fn(),
                updateStartedAt: jest.fn(),
            },
        });

        it('ignores the data of a superseded run', async () => {
            const ctx = createCtx({});

            await getComputedFromWebservice(ctx);

            expect(ctx.precomputed.updateStatus).not.toHaveBeenCalled();
        });

        it('ignores the failure of a superseded run', async () => {
            const ctx = createCtx({ error: { type: 't', message: 'm' } });

            await getFailureFromWebservice(ctx);

            expect(ctx.precomputed.updateStatus).not.toHaveBeenCalled();
        });
    });
});
