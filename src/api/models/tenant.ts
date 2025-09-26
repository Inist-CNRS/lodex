// @ts-expect-error TS(2792): Cannot find module 'lodash/omit'. Did you mean to ... Remove this comment to see the full error message
import omit from 'lodash/omit';
import { ObjectId } from 'mongodb';
import { castIdsFactory, getCreatedCollection } from './utils';

export default async (db: any) => {
    const collection = await getCreatedCollection(db, 'tenant');

    collection.findOneById = async (id: any) =>
        collection.findOne({ $or: [{ _id: new ObjectId(id) }, { _id: id }] });

    collection.findOneByName = async (name: any) =>
        collection.findOne({ name });

    // sort by createdAt desc if sort is provided. No sort by default
    collection.findAll = async (sort = {}) =>
        collection.find({}).sort(sort).toArray();

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

    collection.castIds = castIdsFactory(collection);

    return collection;
};
