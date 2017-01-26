export default (db) => {
    const collection = db.collection('field');
    collection.findAll = () => collection.find({}).toArray();
    collection.upsertOneByName = (name, field) => collection.updateOne({
        name,
    }, field, { upsert: true });
    collection.removeByName = name => collection.remove({ name });

    return collection;
};
