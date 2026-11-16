import config from 'config';
import { sweepTenants } from './sweep';
import { PRECOMPUTED_NO_RESPONSE } from '../../models/precomputed';

jest.mock('./siteGeneration', () => ({ advanceSiteGeneration: jest.fn() }));
import { advanceSiteGeneration } from './siteGeneration';

describe('sweepTenants', () => {
    const calls: string[] = [];
    const now = new Date('2026-01-01T00:00:00Z');

    beforeEach(() => {
        calls.length = 0;
        (advanceSiteGeneration as jest.Mock).mockReset();
    });

    it('expires unanswered precomputations then advances, per tenant', async () => {
        const expire = jest.fn(async () => {
            calls.push('expire');
            return 0;
        });
        (advanceSiteGeneration as jest.Mock).mockImplementation(async () => {
            calls.push('advance');
        });
        await sweepTenants(
            ['a'],
            now,
            (tenant) =>
                ({ tenant, precomputed: { expireUnanswered: expire } }) as any,
        );
        expect(expire).toHaveBeenCalledWith(
            new Date(
                now.getTime() -
                    config.get<number>('precomputedResponseTimeout'),
            ),
            PRECOMPUTED_NO_RESPONSE,
        );
        expect(calls).toEqual(['expire', 'advance']);
    });

    it('keeps going when a tenant fails', async () => {
        const expire = jest.fn(async () => 0);
        (advanceSiteGeneration as jest.Mock).mockImplementation(
            async (ctx: any) => {
                if (ctx.tenant === 'a') throw new Error('boom');
            },
        );
        await sweepTenants(
            ['a', 'b'],
            now,
            (tenant) =>
                ({ tenant, precomputed: { expireUnanswered: expire } }) as any,
        );
        expect(advanceSiteGeneration).toHaveBeenCalledTimes(2);
        expect(
            (advanceSiteGeneration as jest.Mock).mock.calls[1][0].tenant,
        ).toBe('b');
    });
});
