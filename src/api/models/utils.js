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
