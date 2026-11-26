import debug from 'debug';
import zipObject from 'lodash/zipObject.js';
import unset from 'lodash/unset.js';
import mongoDatabase from './mongoDatabase.js';
import { buildVectorSearchPipeline } from './buildVectorSearchPipeline.js';
import {
    parseMaxResources,
    parseMinSimilarity,
    scoreToSimilarity,
    similarityToScore,
} from './similarity.js';

const isIndexExist = false;
/**
 * Take `Object` containing a MongoDB query and throw the result
 *
 * The input object must contain a `connectionStringURI` property, containing
 * the connection string to MongoDB.
 *
 * @name LodexRunVSearchPrecomputed
 * @param {string}  [precomputedName] precomputed user name
 * @param {Object}  [valueFieldName=value] field to use as value
 * @param {Object}  [labelFieldName=id] field to use as label
 * @param {Number}  [limit=10] maximum number of results of the vector search (capped at 10000)
 * @param {Number}  [minSimilarity] minimum similarity in [0, 1], replaces `threshold` when valid.
 *                  Like `threshold`, it only applies when the data carries a non-empty `filter`
 *                  (always the case for vsimilar-precomputed, which filters out the current resource).
 * @param {Boolean} [withSimilarity=false] add a `similarity` field (in [0, 1]) to each result
 * @returns {Object}
 */
export default async function LodexRunVSearchPrecomputed(
    this: any,
    data: any,
    feed: any,
) {
    if (this.isLast()) {
        return feed.close();
    }
    const { ezs } = this;
    const {
        filter: filterDocuments,
        referer,
        field,
        precomputedId,
        connectionStringURI,
        skip,
        minValue,
        maxValue,
        maxSize,
    } = data;
    let { queryVector = [] } = data;

    const fds = Array.isArray(field) ? field : [field];
    const fields = fds.filter(Boolean);
    const projection = zipObject(fields, Array(fields.length).fill(true));

    const numDimensions = Number(this.getParam('dimensions'));
    const threshold = Number(this.getParam('threshold'));
    const valueFieldName = this.getParam('valueFieldName');
    // const labelFieldName = this.getParam('labelFieldName');

    const filter = {};

    if (minValue) {
        const minFilter = {
            $gte: Number(minValue),
        };
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        filter[valueFieldName] = {
            ...minFilter,
        };
    }
    if (maxValue) {
        const maxFilter = {
            $lte: Number(maxValue),
        };
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        filter[valueFieldName] = {
            ...maxFilter,
        };
    }

    const db = await mongoDatabase(connectionStringURI);

    const collectionPrecomputed = db.collection('precomputed');
    const document = await collectionPrecomputed.findOne({
        name: this.getParam('precomputedName'),
    });

    const collectionName = `pc_${document ? document._id : precomputedId}`;

    const collection = db.collection(collectionName);
    unset(filterDocuments, '$text');

    // Similar resources: prefer the vector stored for the referer, built from
    // the same columns as the vectors it is compared with. Resources the
    // precomputed did not embed keep the query vector of the routine (title).
    if (referer) {
        // ponytail: no index on `id`, collection scan. Fine while the precomputed
        // is capped by tdmservices.embedding.limit; add an index if that grows
        const source = await collection.findOne({ id: referer.id });
        if (
            Array.isArray(source?.value) &&
            source.value.length > 0 &&
            source.value.every((x: unknown) => typeof x === 'number')
        ) {
            queryVector = source.value;
        }
    }

    // define your MongoDB Vector Search index
    // https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-type/?deployment-type=self&interface=driver&language=nodejs
    const index = {
        name: 'vector_index',
        type: 'vectorSearch',
        definition: {
            fields: [
                {
                    type: 'vector',
                    numDimensions,
                    path: 'value',
                    similarity: 'cosine',
                    quantization: 'scalar',
                },
            ],
        },
    };

    if (!isIndexExist) {
        await collection.createSearchIndex(index);
    }

    const withSimilarityParam = this.getParam('withSimilarity', false);
    const withSimilarity =
        withSimilarityParam === true || withSimilarityParam === 'true';
    const minSimilarity = parseMinSimilarity(this.getParam('minSimilarity'));
    const aggregatePipeline = buildVectorSearchPipeline({
        queryVector,
        filter,
        filterDocuments,
        limit: parseMaxResources(this.getParam('limit')),
        minScore:
            minSimilarity === undefined
                ? threshold
                : similarityToScore(minSimilarity),
    });
    debug('ezs:info')(
        `collection.aggregate(${JSON.stringify(aggregatePipeline)})`,
    );
    const cursor = collection.aggregate(
        aggregatePipeline,
        fields.length > 0
            ? { ...projection, allowDiskUse: true }
            : {
                  allowDiskUse: true,
              },
    );

    const count = await collection
        .aggregate(aggregatePipeline.concat({ $count: 'value' }))
        .toArray();
    if (count.length === 0) {
        return feed.send({ total: 0 });
    }
    const path = ['total'];
    const value = [count[0] ? count[0].value : 0];
    if (referer) {
        path.push('referer');
        value.push(referer);
    }

    const paged = cursor
        .skip(Number(skip || 0))
        .limit(Number(maxSize || 1000000));
    const stream = (
        withSimilarity
            ? paged.map((item: any) => ({
                  ...item,
                  similarity: scoreToSimilarity(item.value),
              }))
            : paged
    )
        .stream()
        .on('error', (e: any) => feed.stop(e))
        .pipe(ezs('assign', { path, value }));
    await feed.flow(stream);
}
