import range from 'lodash.range';
import chunk from 'lodash.chunk';

export default data => {
    const min = Number(data.hits[0].name);
    const roundedMin = Math.floor(min / 10) * 10;
    const max = Number(data.hits.slice(-1)[0].name);
    const roundedMax = Math.floor(max / 10) * 10 + 10;

    const emptyBeforeYears = range(roundedMin, min).map(name => ({
        name,
        count: 0,
    }));

    const emptyAfterYears = range(max + 1, roundedMax).map(name => ({
        name,
        count: 0,
    }));

    const years = [...emptyBeforeYears, ...data.hits, ...emptyAfterYears];

    const decades = chunk(years, 10);

    return {
        hits: decades.map(yearList =>
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
        ),
    };
};
