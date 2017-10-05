import { MongoClient } from 'mongodb';
import config from 'config';
import ezs from 'ezs';
import hasher from 'node-object-hash';
import reducers from '../reducers/';
import publishedDataset from '../models/publishedDataset';

const hashCoerce = hasher({ sort: false, coerce: true });

export const createFunction = MongoClientImpl => async function LodexRunQuery(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const query = this.getParam('query', data.$query || {});
    const limit = this.getParam('limit', data.$limit || 10);
    const skip = this.getParam('skip', data.$skip || 0);
    const sort = this.getParam('sort', data.$sort || {});
    const field = this.getParam('field', data.$field || 'uri');

    const reducer = this.getParam('reducer');

    const { map, reduce, finalize } = reducers[reducer];
    const fields = Array.isArray(field) ? field : [field];
    const collName = String('mp_').concat(hashCoerce.hash({ reducer, fields }));
    const options = {
        query,
        finalize,
        out: {
            replace: collName,
        },
        scope: {
            fields,
        },
    };

    const handleDb = await MongoClientImpl.connect(`mongodb://${config.mongo.host}/${config.mongo.dbName}`);
    const handlePublishedDataset = await publishedDataset(handleDb);

    if (!reducer) {
        throw new Error('reducer= must be defined as parameter.');
    }
    if (!reducers[reducer]) {
        throw new Error(`Unknown reducer '${reducer}'`);
    }

    const result = await handlePublishedDataset.mapReduce(map, reduce, options);
    const stream = result
        .find({})
        .skip(Number(skip))
        .limit(Number(limit))
        .sort(sort)
        .pipe(ezs((data1, feed1) => {
            if (typeof data1 === 'object') {
                feed.write(data1);
            }
            feed1.close();
        }));
    stream.on('error', (error) => {
        feed.write(error);
    });
    stream.on('end', () => {
        handleDb.close();
        feed.close();
    });
};

export default createFunction(MongoClient);
