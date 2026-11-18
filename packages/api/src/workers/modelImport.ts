import config from 'config';
import { catalogModels, downloadModelArchive } from '../services/catalogModel';
import getLogger from '../services/logger';
import repositoryMiddleware from '../services/repositoryMiddleware';
import { importWizardModel } from '../services/siteGeneration/wizardGeneration';
import { failWizardGeneration } from '../services/siteGeneration/wizardJobs';

export { MODEL_IMPORTER } from '../services/siteGeneration/wizardJobs';

const prepareContext = async (ctx: any) => {
    ctx.tenant = ctx.job.data.tenant;
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.catalogModels = catalogModels;
    ctx.availableLoaders = config.get('scripts.loaders');
    ctx.downloadModelArchive = downloadModelArchive;
    return ctx;
};

// Best effort: without it, the generation would stay running in its model
// or settings phase, which no periodic pass moves on
const failRun = async (job: any, ctx: any, error: Error) => {
    try {
        const failCtx = ctx ?? (await prepareContext({ job }));
        await failWizardGeneration(failCtx, job.data.runId, error.message);
    } catch (e) {
        getLogger(job.data.tenant).error('Model import failure write error', {
            error: (e as Error).message,
        });
    }
};

// The model phase of the wizard generation. importWizardModel writes its own
// failures on the generation: an error reaching here is unexpected.
export const processModelImport = (job: any, done: any) => {
    let ctx: any = null;
    const run = async () => {
        ctx = await prepareContext({ job });
        await importWizardModel(ctx, job.data.runId);
    };
    run()
        .then(
            () => done(),
            async (error: Error) => {
                getLogger(job.data.tenant).error('Model import error', {
                    error: error.message,
                });
                await failRun(job, ctx, error);
                done(error);
            },
        )
        .catch((error: Error) => {
            getLogger(job.data.tenant).error('Model import done error', {
                error: error.message,
            });
        });
};
