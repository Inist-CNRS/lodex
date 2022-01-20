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
            handlePublishError();
            done(err);
        });
};

const startJobEnrichment = async job => {
    const ctx = await prepareContext({ job });
    await startEnrichment(ctx);
};

const handlePublishError = async job => {
    const ctx = await prepareContext({ job });
    await setEnrichmentError(ctx);
};

const prepareContext = async ctx => {
    await repositoryMiddleware(ctx, () => Promise.resolve());
    return ctx;
};
