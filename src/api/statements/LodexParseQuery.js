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
        orderBy = '_id/asc',
        invertedFacets = [],
        $query,
        ...facets
    } = data.query;

    const [order, dir] = orderBy.split('/');

    feed.send({
        ...data,
        limit: maxSize,
        skip,
        maxValue: typeof maxValue !== 'undefined' ? Number(maxValue) : null,
        minValue: typeof minValue !== 'undefined' ? Number(minValue) : null,
        query: {
            match,
            invertedFacets,
            facets,
            ...$query,
        },
        sort: {
            [order]: dir === 'asc' ? 1 : -1,
        },
    });
}
