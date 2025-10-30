import {
    startAskForPrecomputed,
    setPrecomputedError,
    notifyListeners,
    startGetPrecomputed,
} from '../services/precomputed/precomputed';
import repositoryMiddleware from '../services/repositoryMiddleware';

export const PRECOMPUTER = 'precomputer';

export const processPrecomputed = (job: any, done: any) => {
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 2.
    startJobPrecomputed(job, done)
        .then(async () => {
            const isFailed = await job.isFailed();
            notifyListeners(`${job.data.tenant}-precomputer`, {
                isPrecomputing: isFailed ? false : true,
                success: !isFailed,
            });
            done();
        })
        .catch((err: any) => {
            handlePrecomputedError(job, err);
            done(err);
        });
};

const startJobPrecomputed = async (job: any) => {
    notifyListeners(`${job.data.tenant}-precomputer`, {
        isPrecomputing: true,
        success: false,
    });
    const ctx = await prepareContext({ job });

    if (job.data.action === 'askForPrecomputed') {
        await startAskForPrecomputed(ctx);
        return;
    }

    if (job.data.action === 'getPrecomputed') {
        await startGetPrecomputed(ctx);
        return;
    }
};

const handlePrecomputedError = async (job: any, err: any) => {
    const ctx = await prepareContext({ job });
    await setPrecomputedError(ctx, err);
};

const prepareContext = async (ctx: any) => {
    ctx.tenant = ctx.job.data.tenant;
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.configTenant = await ctx.configTenantCollection.findLast();
    return ctx;
};
