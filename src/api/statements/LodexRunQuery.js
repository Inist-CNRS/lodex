import ezs from 'ezs';
import set from 'lodash.set';

import publishedDataset from '../models/publishedDataset';
import mongoClient from '../services/mongoClient';

export const createFunction = mongoClientImpl =>
    async function LodexRunQuery(data, feed) {
        if (this.isLast()) {
            return feed.close();
        }
        const filter = this.getParam('filter', data.filter || {});
        const limit = this.getParam('limit', data.limit || 1000000);
        const skip = this.getParam('skip', data.skip || 0);
        const sort = this.getParam('sort', data.sort || {});

        const handleDb = await mongoClientImpl();
        const handle = await publishedDataset(handleDb);
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
                            set(data1, 'total', total);
                        }
                        feed.write(data1);
                    }
                    feed1.end();
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
