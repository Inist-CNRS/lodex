export const getPublication = async (ctx: any) => {
    const publishedDatasetCount = await ctx.publishedDataset.count();
    const characteristics = await ctx.publishedCharacteristic.findAllVersions(
        {},
    );
    const fields = await ctx.field.findAll();

    const fieldsWithCountPromises = fields.map(async (field: any) => ({
        ...field,

        count: 0,
        /* Attempt to fix extreme slowness when loading the home page */
        /*
         await ctx.publishedDataset.countByFacet(field.name, {
            $ne: null,
        }),
        */
    }));

    const fieldsWithCount = await Promise.all(fieldsWithCountPromises);

    return {
        characteristics,
        fields: fieldsWithCount,
        published: publishedDatasetCount > 0,
    };
};

export default async (ctx: any) => {
    ctx.body = await getPublication(ctx);
};
