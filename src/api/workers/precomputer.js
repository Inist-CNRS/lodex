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
            console.log('---------------------');
            console.log('Error while processing precomputed job', err);
            console.log('---------------------');
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
        console.log('---------------------');
        console.log('startAskForPrecomputed');
        console.log('---------------------');
        await startAskForPrecomputed(ctx);
        return;
    }

    if (job.data.action === 'getPrecomputed') {
        console.log('---------------------');
        console.log('startGetPrecomputed');
        console.log('---------------------');
        await startGetPrecomputed(ctx);
        return;
    }
};

const handlePrecomputedError = async (job, err) => {
    const ctx = await prepareContext({ job });
    await setPrecomputedError(ctx, err);
};

const prepareContext = async ctx => {
    console.log('---------------------');
    console.log('prepareContext', ctx.job.data);
    console.log(ctx.job);
    console.log('---------------------');
    ctx.tenant = ctx.job.data.tenant;
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.configTenant = await ctx.configTenantCollection.findLast();
    return ctx;
};
