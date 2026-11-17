import getLogger from '../../services/logger';
import {
    getClientIp,
    isRateLimited,
    postClientError,
    rateLimitClientErrors,
} from './clientError';

jest.mock('../../services/logger');

const error = jest.fn();
(getLogger as jest.Mock).mockReturnValue({ error });

const createCtx = (
    body: unknown,
    headers: Record<string, string> = {},
    ip = '1.1.1.1',
) => ({
    tenant: 'my-tenant',
    status: 200,
    request: { ip, body },
    get: (name: string) => headers[name.toLowerCase()] ?? '',
});

describe('clientError', () => {
    beforeEach(() => error.mockClear());

    it('logs the browser error in the tenant logger without query strings', async () => {
        const ctx = createCtx(
            {
                message: 'x is undefined',
                stack: 'at foo (app.js:1:2)',
                url: 'https://lodex.fr/instance/t/search?q=secret#/data?token=abc',
                source: 'window.onerror',
            },
            { 'user-agent': `Firefox ${'x'.repeat(1000)}` },
        );

        await postClientError(ctx);

        expect(ctx.status).toBe(204);
        expect(getLogger).toHaveBeenCalledWith('my-tenant');
        expect(error).toHaveBeenCalledWith('[BROWSER] x is undefined', {
            source: 'window.onerror',
            url: 'https://lodex.fr/instance/t/search#/data',
            userAgent: expect.stringMatching(/^Firefox x+$/),
            stack: 'at foo (app.js:1:2)',
        });
        expect(error.mock.calls[0][1].userAgent).toHaveLength(300);
    });

    it('rejects a payload without message, like a body the parser could not read', async () => {
        const ctx = createCtx(undefined);
        await postClientError(ctx);
        expect(ctx.status).toBe(400);
        expect(error).not.toHaveBeenCalled();
    });

    it('uses the address appended by the proxy as client ip', () => {
        expect(
            getClientIp(
                createCtx({}, { 'x-forwarded-for': 'spoofed, 9.9.9.9' }),
            ),
        ).toBe('9.9.9.9');
        expect(getClientIp(createCtx({}, {}, '5.5.5.5'))).toBe('5.5.5.5');
    });

    it('rate limits an ip after 20 reports per minute', () => {
        const now = Date.now() + 120_000;
        for (let i = 0; i < 20; i++) {
            expect(isRateLimited('3.3.3.3', now)).toBe(false);
        }
        expect(isRateLimited('3.3.3.3', now)).toBe(true);
        expect(isRateLimited('4.4.4.4', now)).toBe(false);
        expect(isRateLimited('3.3.3.3', now + 61_000)).toBe(false);
    });

    it('rate limits all reports after 300 per minute, whatever the ip', () => {
        const now = Date.now() + 600_000;
        for (let i = 0; i < 300; i++) {
            expect(isRateLimited(`10.0.0.${i}`, now)).toBe(false);
        }
        expect(isRateLimited('10.0.1.1', now)).toBe(true);
    });

    it('answers 429 without calling the next middleware when limited', async () => {
        const now = Date.now();
        jest.spyOn(Date, 'now').mockReturnValue(now + 900_000);
        const next = jest.fn();
        for (let i = 0; i < 20; i++) {
            await rateLimitClientErrors(createCtx({}, {}, '7.7.7.7'), next);
        }
        expect(next).toHaveBeenCalledTimes(20);

        const ctx = createCtx({}, {}, '7.7.7.7');
        await rateLimitClientErrors(ctx, next);
        expect(ctx.status).toBe(429);
        expect(next).toHaveBeenCalledTimes(20);
        jest.restoreAllMocks();
    });
});
