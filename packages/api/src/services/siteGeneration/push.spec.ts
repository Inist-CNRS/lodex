import {
    addSiteGenerationListener,
    pushSiteGeneration,
    removeSiteGenerationListener,
} from './push';
import { getSiteGenerationView } from './siteGeneration';

jest.mock('./siteGeneration', () => ({
    getSiteGenerationView: jest.fn(),
}));
const mockError = jest.fn();
jest.mock('../logger', () => () => ({ error: mockError }));

const ctx = {} as Parameters<typeof pushSiteGeneration>[1];
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('pushSiteGeneration', () => {
    const listener = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        addSiteGenerationListener(listener);
    });

    afterEach(() => removeSiteGenerationListener(listener));

    it('sends the view of the generation to the room of the tenant', async () => {
        jest.mocked(getSiteGenerationView).mockResolvedValue({
            status: 'running',
        } as never);

        pushSiteGeneration('lodex_test', ctx);
        await flush();

        expect(getSiteGenerationView).toHaveBeenCalledWith(ctx);
        expect(listener).toHaveBeenCalledWith({
            room: 'lodex_test-site-generation',
            data: { generation: { status: 'running' } },
        });
    });

    it('reads nothing without a listener', async () => {
        removeSiteGenerationListener(listener);

        pushSiteGeneration('lodex_test', ctx);
        await flush();

        expect(getSiteGenerationView).not.toHaveBeenCalled();
    });

    it('sends the pushes of a tenant in order, one at a time', async () => {
        const reads: ((view: unknown) => void)[] = [];
        jest.mocked(getSiteGenerationView).mockImplementation(
            () => new Promise((resolve) => reads.push(resolve as never)),
        );

        pushSiteGeneration('lodex_test', ctx);
        pushSiteGeneration('lodex_test', ctx);
        await flush();
        // the second read waits for the first push
        expect(reads).toHaveLength(1);

        reads[0]({ status: 'running' });
        await flush();
        expect(reads).toHaveLength(2);
        reads[1]({ status: 'done' });
        await flush();

        expect(
            listener.mock.calls.map(([{ data }]) => data.generation.status),
        ).toEqual(['running', 'done']);
    });

    it('logs a failed read and goes on with the next push', async () => {
        jest.mocked(getSiteGenerationView)
            .mockRejectedValueOnce(new Error('mongo down'))
            .mockResolvedValueOnce({ status: 'running' } as never);

        pushSiteGeneration('lodex_test', ctx);
        pushSiteGeneration('lodex_test', ctx);
        await flush();
        await flush();

        expect(mockError).toHaveBeenCalledWith('Site generation push error', {
            error: 'mongo down',
        });
        expect(listener).toHaveBeenCalledTimes(1);
    });
});
