import config from 'config';
import { MongoClient } from 'mongodb';
import datasetFactory from '../../api/models/dataset';
import publishedDatasetFactory from '../../api/models/publishedDataset';
import fieldFactory from '../../api/models/field';

let db;

export async function connect() {
    if (!db) {
        db = await MongoClient.connect(`mongodb://${config.mongo.host}/${config.mongo.dbName}`);
        db.dataset = await datasetFactory(db);
        db.publishedDataset = await publishedDatasetFactory(db);
        db.field = await fieldFactory(db);
    }

    return db;
}

export async function clear() {
    await connect();
    await db.dataset.remove({});
    await db.publishedDataset.remove({});
    await db.field.remove({});
}
