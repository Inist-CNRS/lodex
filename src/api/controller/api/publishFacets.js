export default async (ctx, fields) => {
    const facetFields = fields.filter(c => c.isFacet);

    return Promise.all(
        facetFields.map(field =>
            ctx.publishedDataset
                .findDistinctValuesForField(field.name)
                .then(values =>
                    Promise.all(
                        values.map(value =>
                            ctx.publishedDataset
                                .countByFacet(field.name, value)
                                .then(count => ({ value, count })),
                        ),
                    ),
                )
                .then(values =>
                    ctx.publishedFacet.insertFacet(field.name, values),
                ),
        ),
    );
};
