import getDocumentTransformer from '../../common/getDocumentTransformer';
import { URI_FIELD_NAME } from '../../common/uris';
import saveStream from './saveStream';
import through from 'through';
import progress from './progress';
import { INITIALIZING_URI } from '../../common/progressStatus';

const initDatasetUriFactory = ctx =>
    async function initDatasetUri() {
        const count = await ctx.dataset.countWithoutUri();
        progress.start(INITIALIZING_URI, count);
        const fields = await ctx.field.findAll();
        const transformUri = getDocumentTransformer(
            ctx.dataset.findBy,
            fields.filter(f => f.name === URI_FIELD_NAME),
        );

        const setURI = async chunk => {
            const transformedChunk = [];
            for (const document of chunk) {
                const uriObject = await transformUri(document);
                console.log('setURI', uriObject);
                transformedChunk.push({ ...document, ...uriObject });
            }
            return transformedChunk;
        };

        const stream = ctx.dataset
            .find({
                uri: { $exists: false },
            })
            .stream();
        await saveStream(data =>
            ctx.dataset.upsertBatch(data, item => ({
                _id: item._id,
            })),
        )(stream, setURI);

        /*  let handled = 0;
        while (handled < count) {
            const dataset = await ctx.dataset.findLimitFromSkip(1000, handled, {
                uri: { $exists: false },
            });
            const transformedDataset = await Promise.all(
                dataset.map(async item => {
                    const uriObject = await transformUri(item);
                    return { ...item, ...uriObject };
                }),
            );

            await ctx.dataset.bulkUpdate(transformedDataset, item => ({
                _id: item._id,
            }));
            handled += dataset.length;
            progress.setProgress(handled);
        } */
    };

export default initDatasetUriFactory;
