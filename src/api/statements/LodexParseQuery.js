export default function LodexParseQuery(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    const {
        maxSize,
        skip,
        maxValue,
        minValue,
        match,
        orderBy = '_id',
        sortDir = -1,
        invertedFacets = [],
        ...facets
    } = data.query;

    feed.send({
        ...data,
        limit: maxSize,
        skip,
        maxValue: typeof maxValue !== 'undefined' && Number(maxValue),
        minValue: typeof minValue !== 'undefined' && Number(minValue),
        query: {
            match,
            invertedFacets,
            facets,
        },
        sort: {
            [orderBy]: parseInt(sortDir, 10),
        },
    });
}
