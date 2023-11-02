import {
    startPrecomputed,
    setPrecomputedError,
    notifyListeners,
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
    await startPrecomputed(ctx);
};

const handlePrecomputedError = async (job, err) => {
    const ctx = await prepareContext({ job });
    await setPrecomputedError(ctx, err);
};

const prepareContext = async ctx => {
    ctx.tenant = ctx.job.data.tenant;
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.currentConfig = await ctx.configTenant.findLast();
    return ctx;
};
