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

        if (!queryResult.acknowledged) {
            throw new Error('Error while creating new characteristic version');
        }

        return await collection.findOne({
            _id: queryResult.insertedId,
        });
    };

    collection.findAllVersions = () =>
        collection
            .find({})
            .sort({ publicationDate: -1 })
            .toArray();

    return collection;
};
