import chunk from 'lodash/chunk';
import { ObjectID } from 'mongodb';

export default (db) => {
    const collection = db.collection('publishedCharacteristic');

    collection.insertBatch = documents => chunk(documents, 100).map(data => collection.insertMany(data));

    collection.updateValueById = (id, value) => collection.findOneAndUpdate({
        _id: new ObjectID(id),
    }, {
        $set: { value },
    }, {
        returnOriginal: false,
    });

    return collection;
};
