import zipObject from 'lodash/zipObject.js';
import { Readable } from 'stream';
import mongoDatabase from './mongoDatabase.js';

/**
 * Take `Object` containing a MongoDB query and throw the result
 *
 * The input object must contain a `connectionStringURI` property, containing
 * the connection string to MongoDB.
 *
 * @name LodexRunQuery
 * @param {String}  [collection="publishedDataset"]  collection to use
 * @param {Object}  [referer]      data injected into every result object
 * @param {Object}  [filter]       MongoDB filter
 * @param {String}  [sortOn]       Field to sort on
 * @param {String}  [sortOrder]    Oder to sort
 * @param {Object}  [field="uri"]  limit the result to some fields
 * @param {Object}  [limit]        limit the result
 * @param {Object}  [skip]         limit the result
 * @returns {Object}
 */
export const createFunction = () =>
    async function LodexRunQuery(this: any, data: any, feed: any) {
        if (this.isLast()) {
            return feed.close();
        }
        const { ezs } = this;
        const referer = this.getParam('referer', data.referer);
        const filter = this.getParam('filter', data.filter || {});

        filter.removedAt = { $exists: false };
        const sortOn = this.getParam('sortOn', data.sortOn);
        const sortOrder = this.getParam('sortOrder', data.sortOrder);
        const field = this.getParam('field', data.field || data.$field || 'uri');
        const collectionName = String(
            this.getParam('collection', data.collection || 'publishedDataset'),
        );
        const fds = Array.isArray(field) ? field : [field];
        const fields = fds.filter(Boolean);
        const limit = Number(this.getParam('limit', data.limit || 1000000));
        const skip = Number(this.getParam('skip', data.skip || 0));
        const projection = zipObject(fields, Array(fields.length).fill(true));
        const connectionStringURI = this.getParam(
            'connectionStringURI',
            data.connectionStringURI || this.getEnv('connectionStringURI'),
        );

        const db = await mongoDatabase(connectionStringURI);
        const collection = db.collection(collectionName);

        // Compter sans curseur long
        const total = await collection.countDocuments(filter);
        if (total === 0) {
            return feed.send({ total: 0 });
        }

        const path = ['total'];
        const value = [total];
        if (referer) {
            path.push('referer');
            value.push(referer);
        }

        const BATCH_SIZE = 1000;

        // Readable qui pagine par batch : aucun curseur ne reste ouvert longtemps
        const readable = new Readable({
            objectMode: true,
            async read() {
                // 'read' sera appelé automatiquement par le stream quand il est prêt
                // On pilote nous-mêmes via _fetchNext pour éviter des appels concurrents
            },
        });

        // Fonction de pagination asynchrone découplée du mécanisme read()
        (async () => {
            let fetched = 0;
            const maxDocs = limit;

            while (fetched < maxDocs) {
                const batchLimit = Math.min(BATCH_SIZE, maxDocs - fetched);
                let query = collection.find(
                    filter,
                    fields.length > 0 ? { projection } : {},
                );

                if (sortOn) {
                    query = query
                        .sort(`versions.${sortOn}`, sortOrder === 'desc' ? -1 : 1)
                        .allowDiskUse();
                }

                const batch = await query
                    .skip(skip + fetched)
                    .limit(batchLimit)
                    .toArray(); // curseur ouvert le temps d'un batch seulement

                if (batch.length === 0) break;

                for (const doc of batch) {
                    // Respecte la back-pressure du stream aval
                    if (!readable.push(doc)) {
                        await new Promise<void>((resolve) =>
                            readable.once('drain', resolve),
                        );
                    }
                }

                fetched += batch.length;
                if (batch.length < batchLimit) break; // plus de données
            }

            readable.push(null); // fin du stream
        })().catch((err) => readable.destroy(err));

        const stream = readable
            .on('error', (e: any) => feed.stop(e))
            .pipe(ezs('assign', { path, value }));

        await feed.flow(stream);
    };

export default {
    runQuery: createFunction(),
};
