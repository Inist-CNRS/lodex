import Queue from 'bull';
import {
    startEnrichment,
    setEnrichmentError,
} from '../services/enrichment/enrichment';
import repositoryMiddleware from '../services/repositoryMiddleware';

export const PROCESS = 'process';
export const ENRICHER_QUEUE = 'enrichment';
export const enricherQueue = new Queue(ENRICHER_QUEUE, process.env.REDIS_URL, {
    defaultJobOptions: { removeOnComplete: 100, removeOnFail: 100 },
});

enricherQueue.process(PROCESS, (job, done) => {
    startJobEnrichment(job)
        .then(() => {
            job.progress(100);
            done();
        })
        .catch(err => {
            handlePublishError();
            done(err);
        });
});

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