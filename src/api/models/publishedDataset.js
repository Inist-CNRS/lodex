import { ObjectID } from 'mongodb';
import chunk from 'lodash.chunk';
import omit from 'lodash.omit';

export default (db) => {
    const collection = db.collection('publishedDataset');

    collection.insertBatch = documents => chunk(documents, 100).map(data => collection.insertMany(data));

    collection.findLimitFromSkip = (limit, skip, filter) =>
        collection.find(filter).skip(skip).limit(limit).toArray();

    collection.findPage = (page = 0, perPage = 10) =>
        collection.findLimitFromSkip(perPage, page * perPage, { removedAt: { $exists: false } });

    collection.findRemovedPage = (page = 0, perPage = 10) =>
        collection.findLimitFromSkip(perPage, page * perPage, { removedAt: { $exists: true } });

    collection.countRemoved = () =>
        collection.count({ removedAt: { $exists: true } });

    collection.countWithoutRemoved = () =>
        collection.count({ removedAt: { $exists: false } });

    collection.getFindAllStream = () =>
        collection.find({ removedAt: { $exists: false } }).stream();

    collection.findById = async (id) => {
        const oid = new ObjectID(id);
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
                        ...omit(newVersion, ['uri', '_id']),
                        publicationDate,
                    },
                },
            },
        );

    collection.hide = async (uri, reason, date = new Date()) =>
        collection.update({ uri }, { $set: {
            removedAt: date,
            reason,
        } });

    collection.restore = async uri =>
        collection.update({ uri }, { $unset: { removedAt: true, reason: true } });

    collection.addFieldToResource = async (uri, contributor, field, publicationDate = new Date()) => {
        const previousResource = await collection.findByUri(uri);

        const newVersion = {
            ...previousResource.versions[previousResource.versions.length - 1],
            [field.name]: field.value,
            publicationDate,
        };

        return collection.update({ uri }, {
            $addToSet: {
                contributions: {
                    fieldName: field.name,
                    contributor,
                },
            },
            $push: {
                versions: {
                    ...newVersion,
                    publicationDate,
                },
            },
        });
    };

    return collection;
};
