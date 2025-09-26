import { ObjectId } from 'mongodb';
// @ts-expect-error TS(2792): Cannot find module 'lodash/omit'. Did you mean to ... Remove this comment to see the full error message
import omit from 'lodash/omit';
import { castIdsFactory, getCreatedCollection } from './utils';

export default async (db: any) => {
    const collection = await getCreatedCollection(db, 'configTenant');

    collection.findOneById = async (id: any) =>
        collection.findOne({ $or: [{ _id: new ObjectId(id) }, { _id: id }] });

    collection.findAll = async () => collection.find({}).toArray();

    collection.findLast = async () => {
        const items = await collection
            .find({})
            .sort({ _id: -1 })
            .limit(1)
            .toArray();

        if (items.length) return items[0];

        return null;
    };

    collection.create = async (data: any) => {
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({ _id: insertedId });
    };

    collection.delete = async (id: any) =>
        collection.deleteOne({ $or: [{ _id: new ObjectId(id) }, { _id: id }] });

    collection.update = async (id: any, data: any) => {
        const objectId = new ObjectId(id);
        return collection.findOneAndReplace(
            {
                $or: [{ _id: objectId }, { _id: id }],
            },
            omit(data, ['_id']),
            { returnDocument: 'after' },
        );
    };

    collection.castIds = castIdsFactory(collection);

    return collection;
};
