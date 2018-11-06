import getDecadeFromData from './getDecadeFromData';

describe('getDecadeFromData', () => {
    it('should regroup year data by decade', () => {
        expect(
            getDecadeFromData(
                {
                    hits: [
                        { name: 1985, count: 1 },
                        { name: 1986, count: 1 },
                        { name: 1987, count: 1 },
                        { name: 1988, count: 1 },
                        { name: 1989, count: 1 },
                        { name: 1990, count: 1 },
                        { name: 1991, count: 1 },
                    ],
                },
                false,
            ),
        ).toEqual({
            hits: [
                { count: 5, name: { from: 1985, to: 1989 } },
                { count: 2, name: { from: 1990, to: 1991 } },
            ],
        });
    });

    it('should regroup year data by decade in revers order if reverse is true', () => {
        expect(
            getDecadeFromData(
                {
                    hits: [
                        { name: 1991, count: 1 },
                        { name: 1990, count: 1 },
                        { name: 1989, count: 1 },
                        { name: 1988, count: 1 },
                        { name: 1987, count: 1 },
                        { name: 1986, count: 1 },
                        { name: 1985, count: 1 },
                    ],
                },
                true,
            ),
        ).toEqual({
            hits: [
                { count: 2, name: { from: 1990, to: 1991 } },
                { count: 5, name: { from: 1985, to: 1989 } },
            ],
        });
    });

    it('should do nothing if hits is empty', () => {
        expect(
            getDecadeFromData({
                hits: [],
            }),
        ).toEqual({
            hits: [],
        });
    });
});
