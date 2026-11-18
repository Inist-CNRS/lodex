import config from 'config';
import { isSweepingProcess, sweepTenants } from './sweep';
import { PRECOMPUTED_NO_RESPONSE } from '../../models/precomputed';
import { ProgressStatus } from '@lodex/common';
import progress from '../progress';
import { notifyListeners } from '../precomputed/precomputed';

jest.mock('../precomputed/precomputed', () => ({
    notifyListeners: jest.fn(),
}));

jest.mock('./siteGeneration', () => ({
    advanceSiteGeneration: jest.fn(),
    failLostSiteGenerationJob: jest.fn(),
    settleStoppingSiteGeneration: jest.fn(),
}));
import {
    advanceSiteGeneration,
    failLostSiteGenerationJob,
    settleStoppingSiteGeneration,
} from './siteGeneration';

describe('sweepTenants', () => {
    const calls: string[] = [];
    const now = new Date('2026-01-01T00:00:00Z');

    beforeEach(() => {
        calls.length = 0;
        (advanceSiteGeneration as jest.Mock).mockReset();
        (settleStoppingSiteGeneration as jest.Mock).mockReset();
        (failLostSiteGenerationJob as jest.Mock).mockReset();
    });

    it('fails a generation whose job is lost, per tenant', async () => {
        const expire = jest.fn(async () => 0);
        await sweepTenants(
            ['a', 'b'],
            now,
            (tenant) =>
                ({ tenant, precomputed: { expireUnanswered: expire } }) as any,
        );
        expect(
            (failLostSiteGenerationJob as jest.Mock).mock.calls.map(
                ([ctx, date]) => [ctx.tenant, date],
            ),
        ).toEqual([
            ['a', now],
            ['b', now],
        ]);
    });

    it('settles a stopping generation, per tenant', async () => {
        const expire = jest.fn(async () => 0);
        await sweepTenants(
            ['a', 'b'],
            now,
            (tenant) =>
                ({ tenant, precomputed: { expireUnanswered: expire } }) as any,
        );
        expect(
            (settleStoppingSiteGeneration as jest.Mock).mock.calls.map(
                ([ctx]) => ctx.tenant,
            ),
        ).toEqual(['a', 'b']);
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

    describe('when precomputations expire', () => {
        const startPrecomputing = (tenant: string) =>
            progress.start(tenant, {
                status: ProgressStatus.PRECOMPUTING,
                target: 100,
                type: 'precomputer',
            });
        const sweep = (tenant: string, expired: number, pending: number) =>
            sweepTenants(
                [tenant],
                now,
                () =>
                    ({
                        tenant,
                        precomputed: {
                            expireUnanswered: async () => expired,
                            countDocuments: async () => pending,
                        },
                    }) as any,
            );

        beforeEach(() => {
            (notifyListeners as jest.Mock).mockReset();
        });

        it('finishes the progress and tells the admin', async () => {
            startPrecomputing('expired');
            await sweep('expired', 1, 0);
            expect(progress.getStatus('expired')).toBe(ProgressStatus.PENDING);
            expect(notifyListeners).toHaveBeenCalledWith(
                'expired-precomputer',
                { isPrecomputing: false, success: false },
            );
        });

        it('keeps the progress of a precomputation still running', async () => {
            startPrecomputing('running');
            await sweep('running', 1, 1);
            expect(progress.getStatus('running')).toBe(
                ProgressStatus.PRECOMPUTING,
            );
            expect(notifyListeners).toHaveBeenCalledWith(
                'running-precomputer',
                { isPrecomputing: true, success: false },
            );
        });

        it('leaves another job progress', async () => {
            progress.start('publishing', {
                status: ProgressStatus.PUBLISH_DOCUMENT,
                target: 100,
            });
            await sweep('publishing', 1, 0);
            expect(progress.getStatus('publishing')).toBe(
                ProgressStatus.PUBLISH_DOCUMENT,
            );
        });

        it('does nothing when none expired', async () => {
            startPrecomputing('none');
            await sweep('none', 0, 0);
            expect(progress.getStatus('none')).toBe(
                ProgressStatus.PRECOMPUTING,
            );
            expect(notifyListeners).not.toHaveBeenCalled();
        });
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

describe('isSweepingProcess', () => {
    it.each([
        ['outside of pm2', undefined, true],
        ['in the first pm2 process', '0', true],
        ['in another pm2 process', '1', false],
    ])('%s', (_name, instance, expected) => {
        expect(isSweepingProcess(instance)).toBe(expected);
    });
});
