import chunk from 'lodash/chunk';

export default (db) => {
    const collection = db.collection('publishedDataset');
    collection.insertBatch = documents => chunk(documents, 100).map(data => collection.insertMany(data));
    collection.findLimitFromSkip = (limit, skip) => collection.find().skip(skip).limit(limit).toArray();

    return collection;
};
