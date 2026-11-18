export const getPublication = async (ctx: any) => {
    const [publishedDocument, lastCharacteristics, fields] = await Promise.all([
        // only whether something is published: no need to count the documents
        ctx.publishedDataset.findOne({}, { projection: { _id: 1 } }),
        // clients only read the last version, the history grows on each save
        ctx.publishedCharacteristic.findLastVersion(),
        ctx.field.findAll(),
    ]);
    const characteristics = lastCharacteristics ? [lastCharacteristics] : [];

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
        published: !!publishedDocument,
    };
};

export default async (ctx: any) => {
    ctx.body = await getPublication(ctx);
};
