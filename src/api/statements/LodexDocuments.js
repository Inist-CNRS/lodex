import ezs from 'ezs';

import publishedDataset from '../models/publishedDataset';
import mongoClient from '../services/mongoClient';

export const createFunction = mongoClientImpl =>
    async function LodexDocuments(data, feed) {
        if (this.isLast()) {
            return feed.close();
        }

        const filter = this.getParam('filter', data.filter || {});
        const handleDb = await mongoClientImpl();
        const handle = await publishedDataset(handleDb);
        const cursor = handle.find(filter);
        const total = await cursor.count();
        const output = cursor.pipe(
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
        );
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
