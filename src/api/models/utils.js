import { ObjectId } from 'mongodb';

export const castIdsFactory = (collection) => async () => {
    const items = await collection.find({}).toArray();

    return items.reduce(
        (acc, item) =>
            acc.then(async () => {
                await acc;
                await collection.deleteOne({ _id: item._id });
                await collection.insertOne({
                    ...item,
                    _id: new ObjectId(item._id),
                });
            }),
        Promise.resolve(),
    );
};

const checkIfCollectionExists = async (db, collectionName) => {
    const found = await db
        .listCollections({ name: collectionName }, { nameOnly: true })
        .toArray();
    return found.length !== 0;
};

export const getCreatedCollection = async (db, collectionName) => {
    const collExists = await checkIfCollectionExists(db, collectionName);
    if (!collExists) {
        try {
            await db.createCollection(collectionName);
        } catch (error) {
            // in some cases, with concurrent access, creation is simultaneous.
            const collAlreadyExists = await checkIfCollectionExists(
                db,
                collectionName,
            );
            if (!collAlreadyExists) {
                throw error;
            }
        }
    }
    return db.collection(collectionName);
};
