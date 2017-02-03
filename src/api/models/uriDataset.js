export default (db) => {
    const collection = db.collection('dataset');
    collection.findLimitFromSkip = (limit, skip) => collection.find().skip(skip).limit(limit).toArray();

    return collection;
};
