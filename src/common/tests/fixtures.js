import config from 'config';
import { MongoClient } from 'mongodb';
import datasetFactory from '../../api/models/dataset';
import publishedDatasetFactory from '../../api/models/publishedDataset';
import publishedCharacteristicFactory from '../../api/models/publishedCharacteristic';
import fieldFactory from '../../api/models/field';
import uriDatasetFactory from '../../api/models/uriDataset';

let db;

export async function connect() {
    if (!db) {
        db = await MongoClient.connect(`mongodb://${config.mongo.host}/${config.mongo.dbName}`);
        db.dataset = await datasetFactory(db);
        db.publishedDataset = await publishedDatasetFactory(db);
        db.publishedCharacteristic = await publishedCharacteristicFactory(db);
        db.field = await fieldFactory(db);
        db.uriDataset = await uriDatasetFactory(db);
    }

    return db;
}

export async function loadFixtures(fixtures) {
    if (fixtures.field) {
        db.field.insertMany(fixtures.field);
    }
    if (fixtures.dataset) {
        db.dataset.insertMany(fixtures.dataset);
    }
    if (fixtures.publishedDataset) {
        db.publishedDataset.insertMany(fixtures.publishedDataset);
    }
    if (fixtures.publishedCharacteristic) {
        db.publishedCharacteristic.insertMany(fixtures.publishedCharacteristic);
    }
    if (fixtures.uriDataset) {
        db.uriDataset.insertMany(fixtures.uriDataset);
    }
}

export async function clear() {
    await connect();
    await db.dataset.remove({});
    await db.publishedDataset.remove({});
    await db.publishedCharacteristic.remove({});
    await db.field.remove({});
    await db.uriDataset.remove({});
}
