import memoize from 'lodash/memoize';

const countNotUniqueSubresources =
    (collection: any) => async (subresources: any) => {
        const count = await collection.count();

        const countDiffBySubresource = await Object.values(subresources)
            .filter((x: any) => x)
            .reduce(async (acc: any, subresource: any) => {
                const map = await acc;

                const [{ distinct }] = await collection
                    .aggregate([
                        {
                            $project: {
                                id: { $concat: [`$${subresource.path}`] },
                            },
                        },
                        { $group: { _id: null, ids: { $addToSet: '$id' } } },
                        { $project: { distinct: { $size: '$ids' } } },
                    ])
                    .toArray();

                const diff = count - distinct;
                return diff === 0 ? map : { ...map, [subresource.name]: diff };
            }, Promise.resolve({}));

        return countDiffBySubresource;
    };

export default (collection: any) =>
    memoize(countNotUniqueSubresources(collection));
