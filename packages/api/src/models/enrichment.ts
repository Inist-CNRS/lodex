import omit from 'lodash/omit';
import { ObjectId } from 'mongodb';
import { castIdsFactory, getCreatedCollection } from './utils';

export default async (db: any) => {
    const collection: any = await getCreatedCollection(db, 'enrichment');
    await collection.createIndex({ name: 1 }, { unique: true });

    collection.findOneById = async (id: any) =>
        collection.findOne({ $or: [{ _id: new ObjectId(id) }, { _id: id }] });

    collection.findAll = async () => collection.find({}).toArray();

    collection.create = async (data: any) => {
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({ _id: insertedId });
    };

    collection.delete = async (id: any) =>
        collection.deleteOne({ $or: [{ _id: new ObjectId(id) }, { _id: id }] });

    collection.update = async (id: any, data: any) => {
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

    collection.castIds = castIdsFactory(collection);

    return collection;
};
