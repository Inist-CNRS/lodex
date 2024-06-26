import { ObjectID } from 'mongodb';

export const castIdsFactory = (collection) => async () => {
    const items = await collection.find({}).toArray();

    return items.reduce(
        (acc, item) =>
            acc.then(async () => {
                await acc;
                await collection.remove({ _id: item._id });
                await collection.insert({
                    ...item,
                    _id: new ObjectID(item._id),
                });
            }),
        Promise.resolve(),
    );
};
