import Queue from 'bull';
import { startEnrichmentBackground } from '../services/enrichment/enrichmentBackground';
import repositoryMiddleware from '../services/repositoryMiddleware';

export const PROCESS = 'process';
const listeners = [];
export const enrichmentQueue = new Queue('enrichment', process.env.REDIS_URL, {
    defaultJobOptions: { removeOnComplete: 100, removeOnFail: 100 },
});

enrichmentQueue.process(PROCESS, (job, done) => {
    startEnrichment(job)
        .then(() => {
            job.progress(100);
            notifyListeners({ isEnriching: false, success: true });
            done();
        })
        .catch(err => {
            done(err);
        });
});

const startEnrichment = async job => {
    const ctx = await prepareContext({ job });
    const id = ctx.job?.data?.id;
    const enrichment = await ctx.enrichment.findOneById(id);
    notifyListeners({
        isEnriching: true,
        success: false,
        name: enrichment.name,
    });
    await startEnrichmentBackground(ctx);
};

const prepareContext = async ctx => {
    await repositoryMiddleware(ctx, () => Promise.resolve());
    return ctx;
};

export const addEnrichmentListener = listener => listeners.push(listener);
const notifyListeners = payload =>
    listeners.forEach(listener => listener(payload));
