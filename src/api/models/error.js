import chunk from 'lodash/chunk';

export default (db) => {
    const collection = db.collection('error');

    const insertBatch = errors => chunk(errors, 100).map(error => collection.insertMany(error));

    return {
        ...collection,
        insertBatch,
    };
};
