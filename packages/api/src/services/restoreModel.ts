import { text } from 'stream/consumers';

import { MongoClient } from 'mongodb';
import * as tar from 'tar-stream';

export const CONFIG_TENANT_ENTRY = 'config/configTenant.json';

async function extractModelFromArchive(
    fileStream: any,
    authorizedCollections: any,
): Promise<{ collections: unknown; configTenant: unknown }> {
    return new Promise((resolve: any, reject: any) => {
        const extract = tar.extract();
        const extractedData = {};
        let configTenant: unknown;

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

                    if (header.name === CONFIG_TENANT_ENTRY) {
                        configTenant = document;
                        return next();
                    }

                    // header.name is dataset/{collection}/{id}.json
                    const [, collection] = header.name.split('/');

                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    if (!extractedData[collection]) {
                        return next();
                    }

                    // backward compatibility : AUTOGENERATE_URI no longer exists
                    if (document && document.transformers) {
                        const uriField = document.transformers.find(
                            (transformer: any): any =>
                                transformer &&
                                transformer.operation === 'AUTOGENERATE_URI',
                        );
                        if (uriField) {
                            document.transformers = [
                                {
                                    operation: 'COLUMN',
                                    args: [
                                        {
                                            name: 'column',
                                            type: 'column',
                                            value: 'uri',
                                        },
                                    ],
                                },
                            ];
                        }
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
        extract.on('finish', () =>
            resolve({ collections: extractedData, configTenant }),
        );

        fileStream.pipe(extract);
    });
}

export async function restoreModel(
    connectionStringURI: any,
    fileStream: any,
    authorizedCollections: any,
) {
    const { collections: extractedModels, configTenant } =
        await extractModelFromArchive(fileStream, authorizedCollections);

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

    return { configTenant };
}
