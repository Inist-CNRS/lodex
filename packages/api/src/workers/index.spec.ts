const mockOn = jest.fn();

jest.mock('bull', () =>
    jest.fn().mockImplementation(() => ({
        process: jest.fn(),
        on: mockOn,
        close: jest.fn(),
    })),
);
jest.mock('../bullBoard', () => ({ addDashboardQueue: jest.fn() }));
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
import { deleteWorkerQueue, getOrCreateWorkerQueue } from './index';

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
