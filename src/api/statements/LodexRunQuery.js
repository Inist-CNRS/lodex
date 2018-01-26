import { MongoClient } from 'mongodb';
import config from 'config';
import ezs from 'ezs';
import set from 'lodash.set';

import publishedDataset from '../models/publishedDataset';
import field from '../models/field';
import getPublishedDatasetFilter from '../models/getPublishedDatasetFilter';

export const createFunction = MongoClientImpl =>
    async function LodexRunQuery(data, feed) {
        if (this.isLast()) {
            return feed.close();
        }
        const from = this.getParam('from', data.$from || 'dataset');
        const query = this.getParam('query', data.query || {});
        const limit = this.getParam('limit', data.limit || 10);
        const skip = this.getParam('skip', data.skip || 0);
        const sort = this.getParam('sort', data.sort || {});
        const target = this.getParam('total');

        const handleDb = await MongoClientImpl.connect(
            `mongodb://${config.mongo.host}/${config.mongo.dbName}`,
        );
        let handle;
        let filter;
        const fieldHandle = await field(handleDb);
        if (from === 'fields' || from === 'field') {
            handle = fieldHandle;
            filter = {
                ...query.facets,
                removedAt: { $exists: false },
            };
        } else {
            handle = await publishedDataset(handleDb);

            const searchableFieldNames = await fieldHandle.findSearchableNames();
            const facetFieldNames = await fieldHandle.findFacetNames();
            filter = getPublishedDatasetFilter({
                ...query,
                searchableFieldNames,
                facetFieldNames,
            });
        }

        if (filter.$and && !filter.$and.length) {
            delete filter.$and;
        }

        const cursor = handle.find(filter);
        const total = await cursor.count();
        const stream = cursor
            .skip(Number(skip))
            .limit(Number(limit))
            .sort(sort)
            .pipe(
                ezs((data1, feed1) => {
                    if (typeof data1 === 'object') {
                        if (data1) {
                            set(data1, `${target || 'total'}`, total);
                        }
                        feed.write(data1);
                    }
                    feed1.close();
                }),
            );
        stream.on('error', error => {
            feed.write(error);
        });
        stream.on('end', () => {
            handleDb.close();
            feed.close();
        });
    };

export default createFunction(MongoClient);
