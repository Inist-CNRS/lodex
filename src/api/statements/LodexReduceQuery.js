import ezs from 'ezs';
import hasher from 'node-object-hash';
import set from 'lodash.set';

import reducers from '../reducers/';
import publishedDataset from '../models/publishedDataset';
import fieldModel from '../models/field';
import getPublishedDatasetFilter from '../models/getPublishedDatasetFilter';
import mongoClient from '../services/mongoClient';

const hashCoerce = hasher({ sort: false, coerce: true });

export const createFunction = mongoClientImpl =>
    async function LodexRunQuery(data, feed) {
        if (this.isLast()) {
            return feed.close();
        }

        const query = this.getParam('query', data.query || {});
        const limit = this.getParam('limit', data.limit || 1000000);
        const skip = this.getParam('skip', data.skip || 0);
        const sort = this.getParam('sort', data.sort || {});
        const field = this.getParam('field', data.$field || 'uri');
        const target = this.getParam('total');
        const minValue = this.getParam('minValue', data.minValue);
        const maxValue = this.getParam('maxValue', data.maxValue);

        const reducer = this.getParam('reducer');

        const { map, reduce, finalize } = reducers[reducer];
        const fields = Array.isArray(field) ? field : [field];
        const collName = String('mp_').concat(
            hashCoerce.hash({ reducer, fields }),
        );

        const handleDb = await mongoClientImpl();
        const fieldHandle = await fieldModel(handleDb);

        const searchableFieldNames = await fieldHandle.findSearchableNames();
        const facetFieldNames = await fieldHandle.findFacetNames();

        const filter = getPublishedDatasetFilter({
            ...query,
            searchableFieldNames,
            facetFieldNames,
        });
        const options = {
            query: filter,
            finalize,
            out: {
                replace: collName,
            },
            scope: {
                fields,
            },
        };
        const handlePublishedDataset = await publishedDataset(handleDb);

        if (!reducer) {
            throw new Error('reducer= must be defined as parameter.');
        }
        if (!reducers[reducer]) {
            throw new Error(`Unknown reducer '${reducer}'`);
        }

        const cursor = await handlePublishedDataset.mapReduce(
            map,
            reduce,
            options,
        );

        const total = await cursor.count();

        const findFilter = {};

        if (minValue) {
            findFilter.value = {
                $gte: minValue,
            };
        }

        if (maxValue) {
            findFilter.value = {
                ...(findFilter.value || {}),
                $lte: maxValue,
            };
        }

        const stream = cursor
            .find(findFilter)
            .sort(sort)
            .skip(Number(skip))
            .limit(Number(limit))
            .pipe(
                ezs((data1, feed1) => {
                    if (typeof data1 === 'object') {
                        set(data1, `${target || 'total'}`, total);
                        feed.write(data1);
                    }
                    feed1.close();
                }),
            );
        stream.on('error', error => {
            feed.write(error);
        });
        stream.on('end', () => {
            feed.close();
        });
    };

export default createFunction(mongoClient);
