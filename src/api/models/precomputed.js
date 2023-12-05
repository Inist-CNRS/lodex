import { ObjectId } from 'mongodb';
import omit from 'lodash.omit';
import { castIdsFactory } from './utils';

const checkMissingFields = data =>
    !data.name ||
    !data.webServiceUrl ||
    !data.sourceColumns ||
    (data.sourceColumns instanceof Array && data.sourceColumns.length === 0);

export default async db => {
    const collection = db.collection('precomputed');
    await collection.createIndex({ name: 1 }, { unique: true });

    collection.findOneById = async id =>
        collection.findOne(
            { $or: [{ _id: new ObjectId(id) }, { _id: id }] },
            { projection: { data: { $slice: 10 } } }, // Limit the size of the data field to 10 elements
        );

    collection.findAll = async () => collection.find({}).toArray();

    collection.create = async data => {
        if (checkMissingFields(data)) {
            throw new Error('Missing required fields');
        }
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({ _id: insertedId });
    };

    collection.delete = async id =>
        collection.remove({ $or: [{ _id: new ObjectId(id) }, { _id: id }] });

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
            .then(result => result.value);
    };

    collection.updateStatus = async (id, status, data = {}) => {
        const newData = { status, ...data };
        try {
            const resUpdate = await collection.updateOne(
                {
                    $or: [{ _id: new ObjectId(id) }, { _id: id }],
                },
                { $set: newData },
            );
            return resUpdate;
        } catch (err) {
            return { error: err };
        }
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

    return collection;
};
