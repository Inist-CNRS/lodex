import { CancelWorkerError } from '.';
import {
    startEnrichment,
    setEnrichmentError,
} from '../services/enrichment/enrichment';
import repositoryMiddleware from '../services/repositoryMiddleware';

export const ENRICHER = 'enricher';

export const processEnrichment = (job, done) => {
    startJobEnrichment(job)
        .then(() => {
            job.progress(100);
            done();
        })
        .catch(err => {
            handleEnrichmentError(job, err);
            done(err);
        });
};

const startJobEnrichment = async job => {
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
    return ctx;
};
