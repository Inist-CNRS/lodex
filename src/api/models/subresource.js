import { ObjectID } from 'mongodb';
import omit from 'lodash.omit';

export default async db => {
    const collection = db.collection('subresource');

    collection.findOneById = async id =>
        collection.findOne({ _id: new ObjectID(id) });

    collection.findAll = async () => collection.find({}).toArray();

    collection.create = async data => {
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({ _id: insertedId });
    };

    collection.delete = async id =>
        collection.remove({ _id: new ObjectID(id) });

    collection.update = async (id, data) => {
        const objectId = new ObjectID(id);

        return collection
            .findOneAndUpdate(
                {
                    _id: objectId,
                },
                omit(data, ['_id']),
                {
                    returnOriginal: false,
                },
            )
            .then(result => result.value);
    };

    return collection;
};
