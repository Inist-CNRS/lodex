import mongo from 'mongodb';
import chunk from 'lodash/chunk';

export default (db) => {
    const collection = db.collection('publishedDataset');
    collection.insertBatch = documents => chunk(documents, 100).map(data => collection.insertMany(data));
    collection.findLimitFromSkip = (limit, skip) => collection.find().skip(skip).limit(limit).toArray();
    collection.findById = async (id) => {
        const oid = new mongo.ObjectID(id);
        return collection.find({ _id: oid });
    };
    collection.addVersion = async (resource, publicationDate = new Date()) =>
        collection.insert({
            ...resource,
            publicationDate,
        });


    return collection;
};
