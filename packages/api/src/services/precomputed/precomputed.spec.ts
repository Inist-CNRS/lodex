import { TaskStatus } from '@lodex/common';
import {
    getComputedFromWebservice,
    getFailureFromWebservice,
    getPrecomputedDataPreview,
    isSupersededAnswer,
    processPrecomputed,
    setPrecomputedError,
    startAskForPrecomputed,
    toPrecomputedEntry,
} from './precomputed';
import progress from '../progress';

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

    describe('toPrecomputedEntry', () => {
        it('identifies the entry by the uri of the published resource', () => {
            expect(
                toPrecomputedEntry({ uri: '2013BOR15210', title: 'Plop' }, [
                    'title',
                ]),
            ).toEqual({
                id: 'uid:/2013BOR15210',
                value: 'Plop',
                name: ['title'],
            });
        });

        it('keeps an uri already prefixed by uid: or ark:', () => {
            expect(
                toPrecomputedEntry({ uri: 'uid:/VEUH4pEaz', title: 'Plop' }, [
                    'title',
                ]).id,
            ).toBe('uid:/VEUH4pEaz');
            expect(
                toPrecomputedEntry({ uri: 'ark:/67375/XYZ', title: 'Plop' }, [
                    'title',
                ]).id,
            ).toBe('ark:/67375/XYZ');
        });

        it('sends the values of several columns as an array', () => {
            expect(
                toPrecomputedEntry(
                    { uri: 'uid:/1', title: 'Plop', subtitle: 'Plip' },
                    ['title', 'subtitle'],
                ),
            ).toEqual({
                id: 'uid:/1',
                value: ['Plop', 'Plip'],
                name: ['title', 'subtitle'],
            });
        });

        it('parses a column holding a JSON string', () => {
            expect(
                toPrecomputedEntry({ uri: 'uid:/1', authors: '["A","B"]' }, [
                    'authors',
                ]).value,
            ).toEqual(['A', 'B']);
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

    describe('status writes of a job', () => {
        const createCtx = (
            data: object,
            isCurrentRun: boolean,
        ): Record<string, any> => ({
            tenant: 'lodex',
            job: {
                id: 'bull-id',
                opts: { jobId: 'run-1' },
                data: { id: 'pid', tenant: 'lodex', ...data },
                progress: jest.fn(),
                log: jest.fn(),
            },
            precomputed: {
                updateStatus: jest.fn(),
                updateStatusOfJob: jest.fn().mockResolvedValue(isCurrentRun),
                updateStartedAt: jest.fn(),
            },
            dataset: { count: jest.fn() },
        });

        it('writes the error of the current run', async () => {
            const ctx = createCtx({ action: 'askForPrecomputed' }, true);

            await setPrecomputedError(ctx, new Error('boom'));

            expect(ctx.precomputed.updateStatusOfJob).toHaveBeenCalledWith(
                'pid',
                'run-1',
                TaskStatus.ERROR,
                { message: 'boom' },
            );
            expect(ctx.precomputed.updateStatus).not.toHaveBeenCalled();
            expect(ctx.precomputed.updateStartedAt).toHaveBeenCalledWith(
                'pid',
                null,
            );
        });

        it('leaves alone the precomputation relaunched since', async () => {
            const ctx = createCtx({ action: 'askForPrecomputed' }, false);
            const finish = jest.spyOn(progress, 'finish');

            await setPrecomputedError(ctx, new Error('boom'));

            expect(ctx.precomputed.updateStartedAt).not.toHaveBeenCalled();
            // the progress belongs to the current run
            expect(finish).not.toHaveBeenCalled();
            expect(ctx.job.progress).not.toHaveBeenCalled();
            finish.mockRestore();
        });

        it.each([
            [
                'relaunched since',
                { status: TaskStatus.ON_HOLD, jobId: 'run-2' },
            ],
            ['stopped since', { status: TaskStatus.CANCELED, jobId: 'run-1' }],
        ])('skips the stalled rerun of a job %s', async (_name, stored) => {
            const ctx = createCtx({ action: 'askForPrecomputed' }, true);
            ctx.precomputed.findOneById = jest
                .fn()
                .mockResolvedValue({ _id: 'pid', name: 'p', ...stored });
            const start = jest.spyOn(progress, 'start');

            await startAskForPrecomputed(ctx);

            expect(start).not.toHaveBeenCalled();
            expect(ctx.precomputed.updateStatusOfJob).not.toHaveBeenCalled();
            expect(ctx.dataset.count).not.toHaveBeenCalled();
            start.mockRestore();
        });

        it('checks a web service answer against the job that asked for it', async () => {
            const ctx = createCtx(
                {
                    action: 'getPrecomputed',
                    askForPrecomputedJobId: 'lodex-precomputed-job-run-0',
                },
                true,
            );

            await setPrecomputedError(ctx, new Error('boom'));

            expect(ctx.precomputed.updateStatusOfJob).toHaveBeenCalledWith(
                'pid',
                'run-0',
                TaskStatus.ERROR,
                { message: 'boom' },
            );
        });

        it('does not ask the web service again from a superseded job', async () => {
            const ctx = createCtx({ action: 'askForPrecomputed' }, false);

            await processPrecomputed({ _id: 'pid', sourceColumns: [] }, ctx);

            expect(ctx.precomputed.updateStatusOfJob).toHaveBeenCalledWith(
                'pid',
                'run-1',
                TaskStatus.IN_PROGRESS,
                expect.any(Object),
            );
            expect(ctx.precomputed.updateStartedAt).not.toHaveBeenCalled();
            expect(ctx.dataset.count).not.toHaveBeenCalled();
        });
    });
});
