import getDocumentTransformer from '../../common/getDocumentTransformer';
import { URI_FIELD_NAME } from '../../common/uris';
import saveStream from './saveStream';
import progress from './progress';
import { INITIALIZING_URI } from '../../common/progressStatus';

const initDatasetUriFactory = ctx =>
    async function initDatasetUri() {
        progress.start({ status: INITIALIZING_URI });
        const fields = await ctx.field.findAll();
        const transformUri = getDocumentTransformer(
            ctx.dataset.findBy,
            fields.filter(f => f.name === URI_FIELD_NAME),
        );

        const setURI = async chunk => {
            const transformedChunk = [];
            for (const document of chunk) {
                const uriObject = await transformUri(document);
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
    };

export default initDatasetUriFactory;
