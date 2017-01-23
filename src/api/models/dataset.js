import chunk from 'lodash/chunk';

export default (db) => {
    const collection = db.collection('dataset');

    const insertBatch = documents => chunk(documents, 100).map(data => collection.insertMany(data));

    return {
        ...collection,
        insertBatch,
    };
};
