import ezs from 'ezs';
import hasher from 'node-object-hash';
import config from 'config';

import publishedDataset from '../models/publishedDataset';
import field from '../models/field';
import getPublishedDatasetFilter from '../models/getPublishedDatasetFilter';
import mongoClient from '../services/mongoClient';

const hashCoerce = hasher({
    sort: false,
    coerce: true,
});
const cacheOptions = {
    max: config.cache.max,
    maxAge: config.cache.maxAge * 1000,
    objectMode: true,
};
const cache = ezs.createCache(cacheOptions);

export const createFunction = mongoClientImpl =>
    async function LodexDocuments(data, feed) {
        if (this.isLast()) {
            return feed.close();
        }
        const handleDb = await mongoClientImpl();
        const { query } = data;
        const fieldHandle = await field(handleDb);
        const searchableFieldNames = await fieldHandle.findSearchableNames();
        const facetFieldNames = await fieldHandle.findFacetNames();
        const filter = getPublishedDatasetFilter({
            ...query,
            searchableFieldNames,
            facetFieldNames,
        });
        if (filter.$and && !filter.$and.length) {
            delete filter.$and;
        }

        const uniqHash = hashCoerce.hash(filter);
        const uniqkey = `id${uniqHash}`;

        const cached = cache.get(uniqkey);

        let output;
        if (cached) {
            output = cached;
        } else {
            const handle = await publishedDataset(handleDb);
            const cursor = handle.find(filter);
            const total = await cursor.count();
            output = cursor
                .pipe(
                    ezs((input, output) => {
                        if (typeof input === 'object') {
                            output.send({
                                $total: total,
                                ...input,
                            });
                        } else {
                            output.send(input);
                        }
                    }),
                )
                .pipe(cache.set(uniqkey));
        }
        output
            .pipe(
                ezs((input, output) => {
                    if (typeof input === 'object') {
                        output.send({
                            $parameter: {
                                ...data,
                            },
                            ...input,
                        });
                    } else {
                        output.send(input);
                    }
                }),
            )
            .pipe(ezs.catch(global.console.error))
            .pipe(
                ezs((input, output) => {
                    if (typeof input === 'object') {
                        feed.write(input);
                        output.end();
                    } else {
                        feed.close();
                        output.close();
                    }
                }),
            );
    };

export default createFunction(mongoClient);
