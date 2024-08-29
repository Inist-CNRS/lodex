import { ObjectId } from 'mongodb';
import { castIdsFactory, getCreatedCollection } from './utils';

export default async (db) => {
    const collection = await getCreatedCollection(db, 'hiddenResource');
    await collection.createIndex({ uri: 1 }, { unique: true });

    collection.findAll = async () => collection.find({}).toArray();
    collection.findOneByUri = async (uri) => collection.findOne({ uri });

    collection.create = async (data) => {
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({
            _id: insertedId,
        });
    };

    collection.deleteByUri = async (uri) => collection.deleteOne({ uri });

    collection.delete = async (id) =>
        collection.deleteOne({ _id: new ObjectId(id) });

    collection.castIds = castIdsFactory(collection);

    return collection;
};
