import chunk from 'lodash/chunk';

export default (db) => {
    const collection = db.collection('publishedCharacteristic');
    collection.insertBatch = documents => chunk(documents, 100).map(data => collection.insertMany(data));
    return collection;
};
