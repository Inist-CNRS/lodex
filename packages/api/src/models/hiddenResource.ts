import { ObjectId } from 'mongodb';
import { castIdsFactory, getCreatedCollection } from './utils';

export default async (db: any) => {
    const collection: any = await getCreatedCollection(db, 'hiddenResource');
    await collection.createIndex({ uri: 1 }, { unique: true });

    collection.findAll = async () => collection.find({}).toArray();
    collection.findOneByUri = async (uri: any) => collection.findOne({ uri });

    collection.create = async (data: any) => {
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({
            _id: insertedId,
        });
    };

    collection.deleteByUri = async (uri: any) => collection.deleteOne({ uri });

    collection.delete = async (id: any) =>
        collection.deleteOne({ _id: new ObjectId(id) });

    collection.castIds = castIdsFactory(collection);

    return collection;
};
