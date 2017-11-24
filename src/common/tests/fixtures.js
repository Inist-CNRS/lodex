import config from 'config';
import { MongoClient } from 'mongodb';
import datasetFactory from '../../api/models/dataset';
import publishedCharacteristicFactory from '../../api/models/publishedCharacteristic';
import publishedDatasetFactory from '../../api/models/publishedDataset';
import publishedFacetFactory from '../../api/models/publishedFacet';
import fieldFactory from '../../api/models/field';
import uriDatasetFactory from '../../api/models/uriDataset';

let db;

export async function connect() {
    if (!db) {
        db = await MongoClient.connect(
            `mongodb://${config.mongo.host}/${config.mongo.dbName}`,
        );
        db.dataset = await datasetFactory(db);
        db.publishedDataset = await publishedDatasetFactory(db);
        db.publishedCharacteristic = await publishedCharacteristicFactory(db);
        db.publishedFacet = await publishedFacetFactory(db);
        db.field = await fieldFactory(db);
        db.uriDataset = await uriDatasetFactory(db);
    }

    return db;
}

export function loadFixtures(fixtures) {
    const promises = [];

    if (fixtures.field) {
        promises.push(db.field.insertMany(fixtures.field));
    }
    if (fixtures.dataset) {
        promises.push(db.dataset.insertMany(fixtures.dataset));
    }
    if (fixtures.publishedDataset) {
        promises.push(
            db.publishedDataset.insertMany(fixtures.publishedDataset),
        );
    }
    if (fixtures.publishedCharacteristic) {
        promises.push(
            db.publishedCharacteristic.insertMany(
                fixtures.publishedCharacteristic,
            ),
        );
    }
    if (fixtures.publishedFacet) {
        promises.push(db.publishedFacet.insertMany(fixtures.publishedFacet));
    }
    if (fixtures.uriDataset) {
        promises.push(db.uriDataset.insertMany(fixtures.uriDataset));
    }

    return Promise.all(promises);
}

export async function clear() {
    await connect();

    return Promise.all([
        db.dataset.remove({}),
        db.field.remove({}),
        db.publishedCharacteristic.remove({}),
        db.publishedDataset.remove({}),
        db.publishedFacet.remove({}),
        db.uriDataset.remove({}),
    ]);
}
