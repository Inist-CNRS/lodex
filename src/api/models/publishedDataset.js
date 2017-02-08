import mongo from 'mongodb';
import chunk from 'lodash/chunk';
import omit from 'lodash.omit';

export default (db) => {
    const collection = db.collection('publishedDataset');
    collection.insertBatch = documents => chunk(documents, 100).map(data => collection.insertMany(data));
    collection.findLimitFromSkip = (limit, skip) => collection.find().skip(skip).limit(limit).toArray();
    collection.findById = async (id) => {
        const oid = new mongo.ObjectID(id);
        return collection.findOne({ _id: oid });
    };

    collection.findByUri = async uri =>
        collection.findOne({ uri });

    collection.addVersion = async (resource, newVersion, publicationDate = new Date()) =>
        collection.update(
            { uri: resource.uri },
            {
                $push: {
                    versions: {
                        ...omit(newVersion, ['uri']),
                        publicationDate,
                    },
                },
            },
        );


    return collection;
};
