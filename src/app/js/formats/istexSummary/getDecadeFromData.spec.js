import getDecadeFromData from './getDecadeFromData';

describe('getDecadeFromData', () => {
    it('should regroup year data by decade', () => {
        expect(
            getDecadeFromData({
                hits: [
                    { name: 1985, count: 1 },
                    { name: 1986, count: 1 },
                    { name: 1987, count: 1 },
                    { name: 1988, count: 1 },
                    { name: 1989, count: 1 },
                    { name: 1990, count: 1 },
                    { name: 1991, count: 1 },
                ],
            }),
        ).toEqual({
            hits: [
                { count: 5, name: { from: 1980, to: 1989 } },
                { count: 2, name: { from: 1990, to: 1999 } },
            ],
        });
    });

    it('should do nothing if hits izs empty', () => {
        expect(
            getDecadeFromData({
                hits: [],
            }),
        ).toEqual({
            hits: [],
        });
    });
});
