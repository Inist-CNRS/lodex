import { ObjectID } from 'mongodb';
import omit from 'lodash.omit';
import { castIdsFactory } from './utils';

export default async db => {
    const collection = db.collection('enrichment');

    collection.findOneById = async id =>
        collection.findOne({ $or: [{ _id: new ObjectID(id) }, { _id: id }] });

    collection.findAll = async () => collection.find({}).toArray();

    collection.create = async data => {
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({ _id: insertedId });
    };

    collection.delete = async id =>
        collection.remove({ $or: [{ _id: new ObjectID(id) }, { _id: id }] });

    collection.update = async (id, data) => {
        const objectId = new ObjectID(id);

        return collection
            .findOneAndUpdate(
                {
                    $or: [{ _id: objectId }, { _id: id }],
                },
                omit(data, ['_id']),
                {
                    returnOriginal: false,
                },
            )
            .then(result => result.value);
    };

    collection.castIds = castIdsFactory(collection);

    return collection;
};
