export default function LodexParseQuery(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    const {
        limit,
        skip,
        maxValue,
        minValue,
        match,
        sortBy,
        sortDir,
        invertedFacets = [],
        ...facets
    } = data.query;
    feed.send({
        ...data,
        limit,
        skip,
        maxValue,
        minValue,
        query: {
            match,
            invertedFacets,
            facets,
        },
        sort: {
            [sortBy]: parseInt(sortDir, 10),
        },
    });
}
