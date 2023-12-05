import {
    startAskForPrecomputed,
    setPrecomputedError,
    notifyListeners,
    startGetPrecomputed,
} from '../services/precomputed/precomputed';
import repositoryMiddleware from '../services/repositoryMiddleware';

export const PRECOMPUTER = 'precomputer';

export const processPrecomputed = (job, done) => {
    startJobPrecomputed(job, done)
        .then(async () => {
            const isFailed = await job.isFailed();
            notifyListeners(`${job.data.tenant}-precomputer`, {
                isPrecomputing: isFailed ? false : true,
                success: !isFailed,
            });
            done();
        })
        .catch(err => {
            handlePrecomputedError(job, err);
            done(err);
        });
};

const startJobPrecomputed = async job => {
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

const handlePrecomputedError = async (job, err) => {
    const ctx = await prepareContext({ job });
    await setPrecomputedError(ctx, err);
};

const prepareContext = async ctx => {
    ctx.tenant = ctx.job.data.tenant;
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.configTenant = await ctx.configTenantCollection.findLast();
    return ctx;
};
