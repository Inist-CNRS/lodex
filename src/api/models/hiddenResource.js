import { ObjectID } from 'mongodb';
import { castIdsFactory } from './utils';

export default async db => {
    const collection = db.collection('hiddenResource');
    await collection.createIndex({ uri: 1 }, { unique: true });

    collection.findAll = async () => collection.find({}).toArray();

    collection.create = async data => {
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({ _id: insertedId });
    };

    collection.delete = async id =>
        collection.remove({ _id: new ObjectID(id) });

    collection.castIds = castIdsFactory(collection);

    return collection;
};
