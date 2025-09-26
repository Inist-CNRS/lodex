import { text } from 'stream/consumers';

import { MongoClient } from 'mongodb';
// @ts-expect-error TS(2792): Cannot find module 'tar-stream'. Did you mean to s... Remove this comment to see the full error message
import * as tar from 'tar-stream';

async function extractModelFromArchive(
    fileStream: any,
    authorizedCollections: any,
) {
    return new Promise((resolve: any, reject: any) => {
        const extract = tar.extract();
        const extractedData = {};

        for (const collection of authorizedCollections) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            extractedData[collection] = [];
        }

        extract.on(
            'entry',
            async function (header: any, stream: any, next: any) {
                const serializedDocument = await text(stream);

                try {
                    const document = JSON.parse(serializedDocument);
                    // header.name is dataset/{collection}/{id}.json
                    const [, collection] = header.name.split('/');

                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    if (!extractedData[collection]) {
                        return next();
                    }

                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    extractedData[collection].push(document);
                    next();
                } catch (e) {
                    next(e);
                }
            },
        );

        extract.on('error', reject);
        extract.on('finish', () => resolve(extractedData));

        fileStream.pipe(extract);
    });
}

export async function restoreModel(
    connectionStringURI: any,
    fileStream: any,
    authorizedCollections: any,
) {
    const extractedModels = await extractModelFromArchive(
        fileStream,
        authorizedCollections,
    );

    const mongoConnection = await MongoClient.connect(connectionStringURI!);

    try {
        const db = mongoConnection.db();

        await Promise.all(
            authorizedCollections.map(async (collection: any) => {
                await db.collection(collection).deleteMany({});
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                if (!extractedModels[collection]?.length) {
                    return;
                }
                await db
                    .collection(collection)
                    // @ts-expect-error TS(2571): Object is of type 'unknown'.
                    .insertMany(extractedModels[collection]);
            }),
        );
    } finally {
        await mongoConnection.close();
    }
}
