import datasetFactory from '../../api/models/dataset';
import publishedCharacteristicFactory from '../../api/models/publishedCharacteristic';
import publishedDatasetFactory from '../../api/models/publishedDataset';
import publishedFacetFactory from '../../api/models/publishedFacet';
import fieldFactory from '../../api/models/field';
import mongoClient from '../../api/services/mongoClient';

let db;

export async function connect() {
    if (!db) {
        db = await mongoClient();
        db.dataset = await datasetFactory(db);
        db.publishedDataset = await publishedDatasetFactory(db);
        db.publishedCharacteristic = await publishedCharacteristicFactory(db);
        db.publishedFacet = await publishedFacetFactory(db);
        db.field = await fieldFactory(db);
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

    return Promise.all(promises);
}

export async function clear() {
    await connect();

    await Promise.all([
        db.dataset.remove({}),
        db.field.remove({}),
        db.publishedCharacteristic.remove({}),
        db.publishedDataset.remove({}),
        db.publishedFacet.remove({}),
    ]);

    return db;
}

export const close = async () => {
    db = undefined;
};
