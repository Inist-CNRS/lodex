import { MongoClient } from 'mongodb';
import config from 'config';
import ezs from 'ezs';
import publishedDataset from '../models/publishedDataset';

export const createFunction = MongoClientImpl => async function LodexRunQuery(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const query = this.getParam('query', {});
    const limit = this.getParam('limit', 10);
    const skip = this.getParam('skip', 0);
    const sort = this.getParam('sort', {});

    const handleDb = await MongoClientImpl.connect(`mongodb://${config.mongo.host}/${config.mongo.dbName}`);
    const handlePublishedDataset = await publishedDataset(handleDb);

    const stream = handlePublishedDataset
        .find(data.$query || query)
        .skip(Number(data.$skip || skip))
        .limit(Number(data.$limit || limit))
        .sort(data.$sort || sort)
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
