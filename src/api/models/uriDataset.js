import ensureIsUnique from './ensureIsUnique';

export default (db) => {
    const collection = db.collection('uriDataset');
    collection.findLimitFromSkip = (limit, skip) => collection.find().skip(skip).limit(limit).toArray();

    collection.ensureIsUnique = ensureIsUnique(collection);

    collection.findBy = async (fieldName, value) => {
        if (!await collection.ensureIsUnique(fieldName)) {
            throw new Error(`${fieldName} value is not unique for every document`);
        }

        const results = await collection.find({ [fieldName]: value }).limit(1).toArray();

        return results[0];
    };
    return collection;
};
