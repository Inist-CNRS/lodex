import {
    getSiteGeneration,
    postRelaunchSiteGeneration,
    postStopSiteGeneration,
} from './siteGeneration';

const mockGetView = jest.fn();
const mockRelaunch = jest.fn();
const mockStop = jest.fn();

jest.mock('../../services/siteGeneration/siteGeneration', () => ({
    getSiteGenerationView: (...args: unknown[]) => mockGetView(...args),
    relaunchSiteGeneration: (...args: unknown[]) => mockRelaunch(...args),
    stopSiteGeneration: (...args: unknown[]) => mockStop(...args),
}));

describe('siteGeneration controller', () => {
    let ctx: any;

    beforeEach(() => {
        jest.clearAllMocks();
        ctx = {};
    });

    describe('getSiteGeneration', () => {
        it('should return the view', async () => {
            const view = { steps: [] };
            mockGetView.mockResolvedValue(view);

            await getSiteGeneration(ctx);

            expect(mockGetView).toHaveBeenCalledWith(ctx);
            expect(ctx.body).toEqual({ generation: view });
        });

        it('should return null without generation', async () => {
            mockGetView.mockResolvedValue(null);

            await getSiteGeneration(ctx);

            expect(ctx.body).toEqual({ generation: null });
        });
    });

    describe.each([
        [
            'postRelaunchSiteGeneration',
            postRelaunchSiteGeneration,
            mockRelaunch,
        ],
        ['postStopSiteGeneration', postStopSiteGeneration, mockStop],
    ])('%s', (_name, handler, mock) => {
        it('should answer ok', async () => {
            mock.mockResolvedValue(true);

            await handler(ctx);

            expect(mock).toHaveBeenCalledWith(ctx);
            expect(ctx.status).toBe(200);
            expect(ctx.body).toEqual({ ok: true });
        });

        it('should answer 409 without generation', async () => {
            mock.mockResolvedValue(false);

            await handler(ctx);

            expect(ctx.status).toBe(409);
            expect(ctx.body).toEqual({ error: 'no_site_generation' });
        });
    });
});
