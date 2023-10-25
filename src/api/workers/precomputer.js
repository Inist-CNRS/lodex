import { CancelWorkerError } from '.';
import {
    startPrecomputed,
    setPrecomputedError,
    notifyListeners,
} from '../services/precomputed/precomputed';
import repositoryMiddleware from '../services/repositoryMiddleware';

export const PRECOMPUTER = 'precomputer';

export const processPrecomputed = (job, done) => {
    startJobPrecomputed(job)
        .then(async () => {
            job.progress(100);
            const isFailed = await job.isFailed();
            notifyListeners(`${job.data.tenant}-precomputer`, {
                isPrecomputing: false,
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
    await startPrecomputed(ctx);
};

const handlePrecomputedError = async (job, err) => {
    const ctx = await prepareContext({ job });
    if (err instanceof CancelWorkerError) {
        const precomputed = await ctx.precomputed.findOneById(ctx.job.data.id);
        ctx.dataset.removeAttribute(precomputed.name);
    }
    await setPrecomputedError(ctx, err);
};

const prepareContext = async ctx => {
    ctx.tenant = ctx.job.data.tenant;
    await repositoryMiddleware(ctx, () => Promise.resolve());
    return ctx;
};
