import omit from 'lodash/omit';
import { ObjectId } from 'mongodb';
import { castIdsFactory, getCreatedCollection } from './utils';

export default async (db) => {
    const collection = await getCreatedCollection(db, 'subresource');

    collection.findOneById = async (id) =>
        collection.findOne({ _id: new ObjectId(id) });

    collection.findAll = async () => collection.find({}).toArray();

    collection.create = async (data) => {
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({ _id: insertedId });
    };

    collection.delete = async (id) =>
        collection.deleteOne({ _id: new ObjectId(id) });

    collection.update = async (id, data) => {
        const objectId = new ObjectId(id);

        return collection.findOneAndUpdate(
            {
                _id: objectId,
            },
            {
                $set: omit(data, ['_id']),
            },
            { returnDocument: 'after' },
        );
    };

    collection.castIds = castIdsFactory(collection);

    return collection;
};
