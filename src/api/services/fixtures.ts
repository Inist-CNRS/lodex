import { DEFAULT_TENANT } from '@lodex/common';
import datasetFactory from '../models/dataset.ts';
import fieldFactory from '../models/field.ts';
import publishedCharacteristicFactory from '../models/publishedCharacteristic.ts';
import publishedDatasetFactory from '../models/publishedDataset.ts';
import publishedFacetFactory from '../models/publishedFacet.ts';
import mongoClient, { closeDb } from './mongoClient.ts';

let db: any;

export async function connect() {
    if (!db) {
        db = await mongoClient(DEFAULT_TENANT);
        db.dataset = await datasetFactory(db);
        db.publishedDataset = await publishedDatasetFactory(db);
        db.publishedCharacteristic = await publishedCharacteristicFactory(db);
        db.publishedFacet = await publishedFacetFactory(db);
        db.field = await fieldFactory(db);
    }

    return db;
}

export function loadFixtures(fixtures: any) {
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
    if (!db) {
        return;
    }

    await Promise.all([
        db.dataset.deleteMany(),
        db.field.deleteMany(),
        db.publishedCharacteristic.deleteMany(),
        db.publishedDataset.deleteMany(),
        db.publishedFacet.deleteMany(),
        db.annotation.deleteMany(),
    ]);

    return db;
}

export const close = async () => {
    await closeDb('default');
    db = undefined;
    await closeDb('admin');
};
