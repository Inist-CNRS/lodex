import range from 'lodash.range';
import chunk from 'lodash.chunk';

export default (data, reverse) => {
    if (!data.hits.length) {
        return data;
    }

    const ascendingHits = reverse ? data.hits.reverse() : data.hits;
    const min = Number(ascendingHits[0].name);
    const roundedMin = Math.floor(min / 10) * 10;
    const max = Number(ascendingHits.slice(-1)[0].name);
    const roundedMax = Math.floor(max / 10) * 10 + 10;

    const emptyBeforeYears = range(roundedMin, min).map(name => ({
        name,
        count: 0,
    }));

    const emptyAfterYears = range(max + 1, roundedMax).map(name => ({
        name,
        count: 0,
    }));

    const years = [...emptyBeforeYears, ...ascendingHits, ...emptyAfterYears];

    const decades = chunk(years, 10).map(yearList =>
        yearList.reduce(
            (acc, { count }) => ({
                ...acc,
                count: acc.count + count,
            }),
            {
                count: 0,
                name: {
                    from: Number(yearList[0].name),
                    to: Number(yearList.slice(-1)[0].name),
                },
            },
        ),
    );

    return {
        hits: reverse ? decades.reverse() : decades,
    };
};
