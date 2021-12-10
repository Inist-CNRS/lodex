import Queue from 'bull';
import { startEnrichmentBackground } from '../services/enrichment/enrichmentBackground';
import repositoryMiddleware from '../services/repositoryMiddleware';

export const PROCESS = 'process';

export const enrichmentQueue = new Queue('enrichment', process.env.REDIS_URL, {
    defaultJobOptions: { removeOnComplete: 100, removeOnFail: 100 },
});

enrichmentQueue.process(PROCESS, (job, done) => {
    startEnrichment(job)
        .then(() => {
            job.progress(100);
            done();
        })
        .catch(err => {
            handleStartEnrichmentError();
            done(err);
        });
});

const startEnrichment = async job => {
    const ctx = await prepareContext({ job });
    await startEnrichmentBackground(ctx);
};

const handleStartEnrichmentError = async () => {};

const prepareContext = async ctx => {
    await repositoryMiddleware(ctx, () => Promise.resolve());
    return ctx;
};
