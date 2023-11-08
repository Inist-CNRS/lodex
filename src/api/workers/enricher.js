import { CancelWorkerError } from '.';
import {
    startEnrichment,
    setEnrichmentError,
    notifyListeners,
} from '../services/enrichment/enrichment';
import repositoryMiddleware from '../services/repositoryMiddleware';

export const ENRICHER = 'enricher';

export const processEnrichment = (job, done) => {
    startJobEnrichment(job)
        .then(async () => {
            job.progress(100);
            const isFailed = await job.isFailed();
            notifyListeners(`${job.data.tenant}-enricher`, {
                isEnriching: false,
                success: !isFailed,
            });
            done();
        })
        .catch(err => {
            handleEnrichmentError(job, err);
            done(err);
        });
};

const startJobEnrichment = async job => {
    notifyListeners(`${job.data.tenant}-enricher`, {
        isEnriching: true,
        success: false,
    });
    const ctx = await prepareContext({ job });
    await startEnrichment(ctx);
};

const handleEnrichmentError = async (job, err) => {
    const ctx = await prepareContext({ job });
    if (err instanceof CancelWorkerError) {
        const enrichment = await ctx.enrichment.findOneById(ctx.job.data.id);
        ctx.dataset.removeAttribute(enrichment.name);
    }
    await setEnrichmentError(ctx, err);
};

const prepareContext = async ctx => {
    ctx.tenant = ctx.job.data.tenant;
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.configTenant = await ctx.configTenantCollection.findLast();
    return ctx;
};
