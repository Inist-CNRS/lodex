const mockOn = jest.fn();

jest.mock('bull', () =>
    jest.fn().mockImplementation(() => ({
        process: jest.fn(),
        on: mockOn,
        close: jest.fn(),
    })),
);
jest.mock('../bullBoard', () => ({ addDashboardQueue: jest.fn() }));
const mockProcessPublication = jest.fn();
jest.mock('./publisher', () => ({
    PUBLISHER: 'publisher',
    processPublication: (...args: unknown[]) => mockProcessPublication(...args),
}));
jest.mock('../services/siteGeneration/sweep', () => ({
    sweepTenants: jest.fn(),
}));
// other modules use the logger as soon as they are loaded
jest.mock('../services/logger', () => {
    const logger = {
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
    };
    return { __esModule: true, default: () => logger };
});

import getLogger from '../services/logger';
import { sweepTenants } from '../services/siteGeneration/sweep';
import {
    deleteWorkerQueue,
    getOrCreateWorkerQueue,
    isJobRunning,
    waitForRunningJob,
} from './index';

const mockLogger = getLogger('tenant');

describe('getOrCreateWorkerQueue', () => {
    afterEach(async () => {
        await deleteWorkerQueue('tenant');
        jest.clearAllMocks();
    });

    const getListener = (event: string) =>
        mockOn.mock.calls.find(([name]) => name === event)?.[1];

    it('should log the errors of the queue', () => {
        getOrCreateWorkerQueue('tenant', 1);

        const error = new Error('Missing lock for job 1 failed');
        getListener('error')(error);

        expect(mockLogger.error).toHaveBeenCalledWith(
            'Worker queue error: Missing lock for job 1 failed',
            error,
        );
    });

    it('should log the stalled jobs of the queue', () => {
        getOrCreateWorkerQueue('tenant', 1);

        getListener('stalled')({ id: 'job-1', data: { jobType: 'enricher' } });

        expect(mockLogger.warn).toHaveBeenCalledWith(
            'Worker job stalled and will run again: job-1 (enricher)',
        );
    });

    it.each([
        ['completed', 'enricher'],
        ['failed', 'enricher'],
        ['completed', 'publisher'],
        ['failed', 'publisher'],
    ])(
        'should advance the site generation of the tenant once a step job is %s (%s)',
        (event, jobType) => {
            getOrCreateWorkerQueue('tenant', 1);

            getListener(event)({
                data: { jobType, tenant: 'demo' },
            });

            expect(sweepTenants).toHaveBeenCalledWith(['demo']);
        },
    );

    it('should not advance the site generation once another job ends', () => {
        getOrCreateWorkerQueue('tenant', 1);

        getListener('completed')({
            data: { jobType: 'import', tenant: 'demo' },
        });

        expect(sweepTenants).not.toHaveBeenCalled();
    });
});

// a clear waits for the running job to stop writing (see stopJobs)
describe('waitForRunningJob', () => {
    afterEach(async () => {
        await deleteWorkerQueue('tenant');
        jest.clearAllMocks();
    });

    // runs a publication job until it calls done()
    let jobCount = 0;
    const runJob = () => {
        const queue: any = getOrCreateWorkerQueue('tenant', 1);
        const processJob = queue.process.mock.calls[0][2];
        const done = jest.fn();
        processJob(
            {
                id: `job-${++jobCount}`,
                data: { jobType: 'publisher', tenant: 'tenant' },
            },
            done,
        );
        const [, jobDone] = mockProcessPublication.mock.calls[0];
        return { done, jobDone };
    };

    it('does not wait without a running job', async () => {
        await expect(waitForRunningJob('tenant', 10)).resolves.toBe(true);
    });

    it('waits until the running job calls done', async () => {
        const { done, jobDone } = runJob();
        const ended = waitForRunningJob('tenant', 1000);

        jobDone(null, 'result');

        await expect(ended).resolves.toBe(true);
        expect(done).toHaveBeenCalledWith(null, 'result');
        await expect(waitForRunningJob('tenant', 10)).resolves.toBe(true);
    });

    it('stops waiting for a job that does not end', async () => {
        runJob();

        await expect(waitForRunningJob('tenant', 10)).resolves.toBe(false);
    });
});

// Bull loses the lock of a job whose event loop stays blocked: it then sees it
// as stalled or failed while it still runs here
describe('the jobs run here', () => {
    afterEach(async () => {
        await deleteWorkerQueue('tenant');
        jest.clearAllMocks();
    });

    const processJob = (id: string, done = jest.fn()) => {
        const queue: any = getOrCreateWorkerQueue('tenant', 1);
        queue.process.mock.calls[0][2](
            { id, data: { jobType: 'publisher', tenant: 'tenant' } },
            done,
        );
        return done;
    };

    it('tells a job is running until it calls done', () => {
        processJob('running-job');
        const [, jobDone] = mockProcessPublication.mock.calls[0];

        expect(isJobRunning('running-job')).toBe(true);
        expect(isJobRunning('other-job')).toBe(false);
        expect(isJobRunning(undefined)).toBe(false);

        jobDone();

        expect(isJobRunning('running-job')).toBe(false);
    });

    it('does not run again a job that already ran here to its end', () => {
        processJob('stalled-job');
        mockProcessPublication.mock.calls[0][1]();
        mockProcessPublication.mockClear();

        // Bull runs it again after it stalled
        const done = processJob('stalled-job');

        expect(mockProcessPublication).not.toHaveBeenCalled();
        expect(done).toHaveBeenCalledWith(undefined);
        expect(isJobRunning('stalled-job')).toBe(false);
    });

    it('ends a job run again after a failed run with the error of that run', () => {
        // its failure could not be written ("Missing lock"): Bull runs it again
        processJob('failed-job');
        const error = new Error('publication failed');
        mockProcessPublication.mock.calls[0][1](error);
        mockProcessPublication.mockClear();

        const done = processJob('failed-job');

        expect(mockProcessPublication).not.toHaveBeenCalled();
        expect(done).toHaveBeenCalledWith(error);
    });
});
