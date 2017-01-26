/* eslint no-await-in-loop: off */
import capitalize from 'lodash.capitalize';

export default async (ctx) => {
    const count = await ctx.dataset.count({});
    let handled = 0;
    let firstData;

    while (handled < count) {
        const dataset = await ctx.dataset.find({}).skip(handled).limit(100).toArray();

        // Keep the first item in dataset for publication metas detection
        if (!firstData) {
            firstData = dataset[0];
        }
        await ctx.publishedDataset.insertMany(dataset);
        handled += dataset.length;
    }

    const publishedModel = Object
        .keys(firstData)
        .filter(k => k !== '_id') // Exclude the mongo db identifier
        .reduce((columns, key) => [
            ...columns,
            {
                key,
                label: capitalize(key).replace('_', ' '),
            },
        ], []);

    await ctx.publishedModel.insertMany(publishedModel);

    ctx.redirect('/api/publication');
};
