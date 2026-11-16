import config from 'config';

import repositoryMiddleware, {
    getTenantCollection,
} from '../repositoryMiddleware';
import mongoClient from '../mongoClient';
import { PRECOMPUTED_NO_RESPONSE } from '../../models/precomputed';
import getLogger from '../logger';
import { advanceSiteGeneration } from './siteGeneration';

const buildContext = async (tenantName: string): Promise<any> => {
    const ctx: any = { tenant: tenantName };
    await repositoryMiddleware(ctx, () => Promise.resolve());
    return ctx;
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
            await ctx.precomputed.expireUnanswered(
                new Date(now.getTime() - timeout),
                PRECOMPUTED_NO_RESPONSE,
            );
            await advanceSiteGeneration(ctx);
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
