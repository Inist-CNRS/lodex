import config from 'config';
import { MongoClient } from 'mongodb';
import datasetFactory from '../../api/models/dataset';
import publishedDatasetFactory from '../../api/models/publishedDataset';
import fieldFactory from '../../api/models/field';

let db;
let dataset;
let publishedDataset;
let field;

async function connect() {
    if (!db) {
        db = await MongoClient.connect(`mongodb://${config.mongo.host}/${config.mongo.dbName}`);
        dataset = await datasetFactory(db);
        publishedDataset = await publishedDatasetFactory(db);
        field = await fieldFactory(db);
    }
}

export async function clear() {
    await connect();
    await dataset.remove({});
    await publishedDataset.remove({});
    await field.remove({});
}
