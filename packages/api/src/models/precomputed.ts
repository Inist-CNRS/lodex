import omit from 'lodash/omit';
import { ObjectId } from 'mongodb';
import { castIdsFactory, getCreatedCollection } from './utils';

const checkMissingFields = (data: any) =>
    !data.name ||
    !data.webServiceUrl ||
    !data.sourceColumns ||
    (data.sourceColumns instanceof Array && data.sourceColumns.length === 0);

export default async (db: any) => {
    const collection = await getCreatedCollection(db, 'precomputed');
    await collection.createIndex({ name: 1 }, { unique: true });

    collection.findOneById = async (id: any) =>
        collection.findOne(
            { $or: [{ _id: new ObjectId(id) }, { _id: id }] },
            { projection: { data: { $slice: 10 } } }, // Limit the size of the data field to 10 elements
        );

    collection.findAll = async () => collection.find({}).toArray();

    collection.create = async (data: any) => {
        if (checkMissingFields(data)) {
            throw new Error('Missing required fields');
        }
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({ _id: insertedId });
    };

    collection.delete = async (id: any) => {
        try {
            await db.collection(`pc_${id}`).drop();
        } catch {
            // Collection does not exist, no big deal
            console.warn(`Failed to drop collection 'pc_${id}'`);
        }
        return collection.deleteOne({
            $or: [{ _id: new ObjectId(id) }, { _id: id }],
        });
    };

    collection.update = async (id: any, data: any) => {
        if (checkMissingFields(data)) {
            throw new Error('Missing required fields');
        }
        const objectId = new ObjectId(id);

        return collection.findOneAndUpdate(
            {
                $or: [{ _id: objectId }, { _id: id }],
            },
            {
                $set: omit(data, ['_id']),
            },
            { returnDocument: 'after' },
        );
    };

    collection.updateStatus = async (id: any, status: any, data = {}) => {
        const newData = { status, ...data };
        collection.updateOne(
            {
                $or: [{ _id: new ObjectId(id) }, { _id: id }],
            },
            { $set: newData },
        );
    };

    collection.updateStartedAt = async (id: any, startedAt: any) => {
        collection.updateOne(
            {
                $or: [{ _id: new ObjectId(id) }, { _id: id }],
            },
            { $set: { startedAt } },
        );
    };

    collection.castIds = castIdsFactory(collection);

    collection.getSample = async (id: any) => {
        return db
            .collection(`pc_${id}`)
            .find({}, { projection: { _id: 0 } })
            .limit(10)
            .toArray();
    };

    collection.getStreamOfResult = async (id: any) => {
        return db
            .collection(`pc_${id}`)
            .find({}, { projection: { _id: 0, id: 1, value: 1 } })
            .stream();
    };

    return collection;
};
