import Queue from 'bull';
import progress from '../services/progress';
import indexSearchableFields from '../services/indexSearchableFields';
import publishFacets from '../controller/api/publishFacets';
import publishCharacteristics from '../services/publishCharacteristics';
import publishDocuments from '../services/publishDocuments';
import repositoryMiddleware from '../services/repositoryMiddleware';
import { CREATE_INDEX } from '../../common/progressStatus';
import {
    SCOPE_COLLECTION,
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
    SCOPE_GRAPHIC,
} from '../../common/scope';

export const PUBLISH = 'publish';

export const publisherQueue = new Queue('publisher', process.env.REDIS_URL);

publisherQueue.process(PUBLISH, (job, done) => {
    console.log('###################');
    console.log('Process!');
    publish()
        .then(() => done())
        .catch(err => {
            handlePublishError();
            done(err);
        });
});

const publish = async () => {
    const ctx = await prepareContext({});

    const count = await ctx.dataset.count({});
    const fields = await ctx.field.findAll();

    const collectionScopeFields = fields.filter(c =>
        [SCOPE_COLLECTION, SCOPE_DOCUMENT].includes(c.scope),
    );

    await ctx.publishDocuments(ctx, count, collectionScopeFields);

    const datasetScopeFields = fields.filter(c =>
        [SCOPE_DATASET, SCOPE_GRAPHIC].includes(c.scope),
    );

    await ctx.publishCharacteristics(ctx, datasetScopeFields, count);
    await ctx.publishFacets(ctx, fields, true);

    progress.start(CREATE_INDEX, null);

    await indexSearchableFields();

    progress.finish();
};

const handlePublishError = async () => {
    const ctx = await prepareContext({});
    await ctx.publishedDataset.remove({});
    await ctx.publishedCharacteristic.remove({});
};

const prepareContext = async ctx => {
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.publishDocuments = publishDocuments;
    ctx.publishCharacteristics = publishCharacteristics;
    ctx.publishFacets = publishFacets;
    return ctx;
};
