export default (db) => {
    const collection = db.collection('field');
    collection.findAll = () => collection.find({}).toArray();

    return collection;
};
