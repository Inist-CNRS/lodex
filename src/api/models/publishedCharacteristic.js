export default db => {
    const collection = db.collection('publishedCharacteristic');

    collection.findLastVersion = async () => {
        const items = await collection
            .find({})
            .sort({ publicationDate: -1 })
            .limit(1)
            .toArray();

        if (items.length) return items[0];

        return null;
    };

    collection.addNewVersion = async characteristics => {
        const queryResult = await collection.insertOne({
            ...characteristics,
            _id: undefined,
            publicationDate: new Date(),
        });

        if (!queryResult.ops.length) {
            throw new Error('Error while creating new characteristic version');
        }

        return queryResult.ops[0];
    };

    collection.findAllVersions = () =>
        collection
            .find({})
            .sort({ publicationDate: -1 })
            .toArray();

    return collection;
};
