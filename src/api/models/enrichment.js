import { ObjectId } from 'mongodb';
import omit from 'lodash/omit';
import { castIdsFactory, getCreatedCollection } from './utils';

export default async (db) => {
    const collection = await getCreatedCollection(db, 'enrichment');
    await collection.createIndex({ name: 1 }, { unique: true });

    collection.findOneById = async (id) =>
        collection.findOne({ $or: [{ _id: new ObjectId(id) }, { _id: id }] });

    collection.findAll = async () => collection.find({}).toArray();

    collection.create = async (data) => {
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({ _id: insertedId });
    };

    collection.delete = async (id) =>
        collection.deleteOne({ $or: [{ _id: new ObjectId(id) }, { _id: id }] });

    collection.update = async (id, data) => {
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

    collection.castIds = castIdsFactory(collection);

    return collection;
};
