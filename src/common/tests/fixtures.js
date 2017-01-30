import config from 'config';
import { MongoClient } from 'mongodb';
import datasetFactory from '../../api/models/dataset';
import publishedDatasetFactory from '../../api/models/publishedDataset';
import fieldsFactory from '../../api/models/field';

let db;
let dataset;
let publishedDataset;
let fields;

async function connect() {
    if (!db) {
        db = await MongoClient.connect(`mongodb://${config.mongo.host}/${config.mongo.dbName}`);
        dataset = datasetFactory(db);
        publishedDataset = publishedDatasetFactory(db);
        fields = fieldsFactory(db);
    }
}

export async function clear() {
    await connect();
    await dataset.remove({});
    await publishedDataset.remove({});
    await fields.remove({});
}
