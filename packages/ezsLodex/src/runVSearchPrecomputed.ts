import zipObject from 'lodash/zipObject.js';
import unset from 'lodash/unset.js';
import mongoDatabase from './mongoDatabase.js';
import { pipeline } from "@huggingface/transformers";

/**
 * Take `Object` containing a MongoDB query and throw the result
 *
 * The input object must contain a `connectionStringURI` property, containing
 * the connection string to MongoDB.
 *
 * @name LodexRunVSearchPrecomputed
 * @param {Object}  [valueFieldName=value] field to use as value
 * @param {Object}  [labelFieldName=id] field to use as label
 * @returns {Object}
 */
async function LodexRunVSearchPrecomputed(this: any, data: any, feed: any) {
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
        orderBy,
        $query,
        queryVector = [],
    } = data;

    const collectionName = `pc_${precomputedId}`;
    const fds = Array.isArray(field) ? field : [field];
    const fields = fds.filter(Boolean);
    const projection = zipObject(fields, Array(fields.length).fill(true));

    const valueFieldName = this.getParam('valueFieldName');
    const labelFieldName = this.getParam('labelFieldName');

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
    const [order, dir] = String(orderBy).split('/');
    const ord = order === 'value' ? valueFieldName : labelFieldName;
    const sort = order && dir ? { [ord]: dir === 'asc' ? 1 : -1 } : {};

    const db = await mongoDatabase(connectionStringURI);
    const collection = db.collection(collectionName);
    unset(filterDocuments, '$text');



    // define your MongoDB Vector Search index
    // https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-type/?deployment-type=self&interface=driver&language=nodejs
    const index = {
        name: "vector_index",
        type: "vectorSearch",
        definition: {
            "fields": [
                {
                    "type": "vector",
                    "numDimensions": 2048,
                    "path": "value",
                    "similarity": "dotProduct",
                    "quantization": "scalar"
                }
            ]
        }
    }


















    const postFilter =
        Object.keys(filterDocuments).length === 0
            ? {}
            : {
                  documents: { $elemMatch: filterDocuments }, //{ "versions.0.abxD": "2033" }
            };
    const aggregatePipeline = [
        {
            $vectorSearch: {
                index: 'vector_index',
                path: 'value',
                filter,
                queryVector,
                numCandidates: 150,
            },
        },
        /*
        {

            $lookup: {
                from: 'publishedDataset',
                localField: 'origin',
                foreignField: 'uri',
                as: 'documents',
            },
        },
        {
            $match: postFilter,
        },
        */
    ];
    console.log('aggregatePipeline', aggregatePipeline );
    const cursor = collection.aggregate(
        aggregatePipeline,
        fields.length > 0
            ? { ...projection, allowDiskUse: true }
            : {
                  allowDiskUse: true,
              },
    );

    const count = await collection
        // @ts-expect-error TS(2339): Property 'concat' does not exist on type '{}'.
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

    const stream = cursor
        .sort(sort)
        .skip(Number(skip || 0))
        .limit(Number(maxSize || 1000000))
        .stream()
        .on('error', (e: any) => feed.stop(e))
        .pipe(ezs('assign', { path, value }));
    await feed.flow(stream);
}

export default {
    runQueryPrecomputed: LodexRunVSearchPrecomputed,
};
