import { ObjectId } from 'mongodb';
import omit from 'lodash/omit';
import { castIdsFactory, getCreatedCollection } from './utils';

const checkMissingFields = (data) =>
    !data.name ||
    !data.webServiceUrl ||
    !data.sourceColumns ||
    (data.sourceColumns instanceof Array && data.sourceColumns.length === 0);

export default async (db) => {
    const collection = await getCreatedCollection(db, 'precomputed');
    await collection.createIndex({ name: 1 }, { unique: true });

    collection.findOneById = async (id) =>
        collection.findOne(
            { $or: [{ _id: new ObjectId(id) }, { _id: id }] },
            { projection: { data: { $slice: 10 } } }, // Limit the size of the data field to 10 elements
        );

    collection.findAll = async () => collection.find({}).toArray();

    collection.create = async (data) => {
        if (checkMissingFields(data)) {
            throw new Error('Missing required fields');
        }
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({ _id: insertedId });
    };

    collection.delete = async (id) => {
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

    collection.update = async (id, data) => {
        if (checkMissingFields(data)) {
            throw new Error('Missing required fields');
        }
        const objectId = new ObjectId(id);

        return collection
            .findOneAndUpdate(
                {
                    $or: [{ _id: objectId }, { _id: id }],
                },
                {
                    $set: omit(data, ['_id']),
                },
                {
                    returnOriginal: false,
                },
            )
            .then((result) => result.value);
    };

    collection.updateStatus = async (id, status, data = {}) => {
        const newData = { status, ...data };
        collection.updateOne(
            {
                $or: [{ _id: new ObjectId(id) }, { _id: id }],
            },
            { $set: newData },
        );
    };

    collection.updateStartedAt = async (id, startedAt) => {
        collection.updateOne(
            {
                $or: [{ _id: new ObjectId(id) }, { _id: id }],
            },
            { $set: { startedAt } },
        );
    };

    collection.castIds = castIdsFactory(collection);

    collection.getSample = async (id) => {
        return db
            .collection(`pc_${id}`)
            .find({}, { projection: { _id: 0 } })
            .limit(10)
            .toArray();
    };

    collection.getStreamOfResult = async (id) => {
        return db
            .collection(`pc_${id}`)
            .find({}, { projection: { _id: 0, id: 1, value: 1 } })
            .stream();
    };

    return collection;
};
