// @ts-expect-error TS(2792): Cannot find module 'lodash/omit'. Did you mean to ... Remove this comment to see the full error message
import omit from 'lodash/omit';
import { ObjectId } from 'mongodb';
import { castIdsFactory, getCreatedCollection } from './utils';

export default async (db: any) => {
    const collection = await getCreatedCollection(db, 'subresource');

    collection.findOneById = async (id: any) =>
        collection.findOne({ _id: new ObjectId(id) });

    collection.findAll = async () => collection.find({}).toArray();

    collection.create = async (data: any) => {
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({ _id: insertedId });
    };

    collection.delete = async (id: any) =>
        collection.deleteOne({ _id: new ObjectId(id) });

    collection.update = async (id: any, data: any) => {
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
