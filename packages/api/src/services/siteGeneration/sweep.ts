import config from 'config';
import { ProgressStatus, TaskStatus } from '@lodex/common';

import repositoryMiddleware, {
    getTenantCollection,
} from '../repositoryMiddleware';
import mongoClient from '../mongoClient';
import { PRECOMPUTED_NO_RESPONSE } from '../../models/precomputed';
import getLogger from '../logger';
import progress from '../progress';
import { notifyListeners } from '../precomputed/precomputed';
import {
    advanceSiteGeneration,
    failLostSiteGenerationJob,
    settleStoppingSiteGeneration,
} from './siteGeneration';

const buildContext = async (tenantName: string): Promise<any> => {
    const ctx: any = { tenant: tenantName };
    await repositoryMiddleware(ctx, () => Promise.resolve());
    return ctx;
};

// An expired precomputation only changes in the database: end its progress
// bar (unless another precomputation still runs) and refresh the admin, as a
// failure answer of the web service does
const releasePrecomputing = async (ctx: any) => {
    const stillRunning =
        (await ctx.precomputed.countDocuments({
            status: { $in: [TaskStatus.IN_PROGRESS, TaskStatus.ON_HOLD] },
        })) > 0;
    if (
        !stillRunning &&
        progress.getStatus(ctx.tenant) === ProgressStatus.PRECOMPUTING
    ) {
        progress.finish(ctx.tenant);
    }
    notifyListeners(`${ctx.tenant}-precomputer`, {
        isPrecomputing: stillRunning,
        success: false,
    });
};

export const sweepTenants = async (
    tenants: string[],
    now = new Date(),
    createContext: (tenantName: string) => Promise<any> = buildContext,
): Promise<void> => {
    const timeout = config.get<number>('precomputedResponseTimeout');
    for (const tenantName of tenants) {
        try {
            const ctx = await createContext(tenantName);
            const expired = await ctx.precomputed.expireUnanswered(
                new Date(now.getTime() - timeout),
                PRECOMPUTED_NO_RESPONSE,
            );
            if (expired > 0) {
                await releasePrecomputing(ctx);
            }
            await advanceSiteGeneration(ctx);
            await settleStoppingSiteGeneration(ctx);
            await failLostSiteGenerationJob(ctx, now);
        } catch (error) {
            getLogger(tenantName).error(
                `Site generation sweep failed for tenant ${tenantName}`,
                error,
            );
        }
    }
};

// In pm2 cluster mode, every process would sweep (and connect to) every
// tenant: only the first one does. NODE_APP_INSTANCE is unset outside of pm2.
export const isSweepingProcess = (
    instance: string | undefined = process.env.NODE_APP_INSTANCE,
) => instance === undefined || instance === '0';

export const startSiteGenerationSweep = (): (() => void) => {
    let running = false;
    const run = async () => {
        if (running) {
            return;
        }
        running = true;
        try {
            const adminDb = await mongoClient('admin');
            const tenantCollection = await getTenantCollection(adminDb);
            const tenants = await tenantCollection.findAll();
            await sweepTenants(tenants.map((t: any) => t.name));
        } catch (error) {
            getLogger().error('Site generation sweep failed', error);
        } finally {
            running = false;
        }
    };
    const timer = setInterval(
        run,
        config.get<number>('siteGenerationSweepInterval'),
    );
    return () => clearInterval(timer);
};
