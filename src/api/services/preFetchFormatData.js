import fetch from '../../common/lib/fetch';

export const preFetchFormatDataFactory = fetchImpl => async (
    fields,
    values,
) => {
    const prefetchedResults = await Promise.all(
        fields.map(async field => {
            const prefetchData = await fetchImpl({
                url: field.format.args.prefetch.replace(
                    '__VALUE__',
                    values[field.name],
                ),
            });

            return { [field.name]: prefetchData };
        }),
    );

    return prefetchedResults.reduce((acc, keyValue) => ({
        ...acc,
        ...keyValue,
    }));
};

export default preFetchFormatDataFactory(fetch);
