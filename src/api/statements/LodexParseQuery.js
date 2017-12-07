export default function LodexParseQuery(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    const {
        limit,
        skip,
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
