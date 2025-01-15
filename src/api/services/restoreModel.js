import { text } from 'stream/consumers';

import { MongoClient } from 'mongodb';
import * as tar from 'tar-stream';

async function extractModelFromArchive(fileStream, authorizedCollections) {
    return new Promise((resolve, reject) => {
        const extract = tar.extract();
        const extractedData = {};

        for (const collection of authorizedCollections) {
            extractedData[collection] = [];
        }

        extract.on('entry', async function (header, stream, next) {
            const serializedDocument = await text(stream);

            try {
                const document = JSON.parse(serializedDocument);
                // header.name is dataset/{collection}/{id}.json
                const [, collection] = header.name.split('/');

                if (!extractedData[collection]) {
                    return next();
                }

                extractedData[collection].push(document);
                next();
            } catch (e) {
                next(e);
            }
        });

        extract.on('error', reject);
        extract.on('finish', () => resolve(extractedData));

        fileStream.pipe(extract);
    });
}

export async function restoreModel(
    connectionStringURI,
    fileStream,
    authorizedCollections,
) {
    const extractedModels = await extractModelFromArchive(
        fileStream,
        authorizedCollections,
    );

    const mongoConnection = await MongoClient.connect(connectionStringURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        const db = mongoConnection.db();

        await Promise.all(
            authorizedCollections.map(async (collection) => {
                await db.collection(collection).deleteMany({});
                if (!extractedModels[collection]?.length) {
                    return;
                }
                await db
                    .collection(collection)
                    .insertMany(extractedModels[collection]);
            }),
        );
    } finally {
        await mongoConnection.close();
    }
}
