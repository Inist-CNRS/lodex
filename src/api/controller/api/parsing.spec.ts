import { getExcerpt } from './parsing';

describe('parsing', () => {
    it('should call ctx.dataset getExcerpt and count and return their result', async () => {
        const getExcerptCall = [];
        const countCall = [];
        const ctx = {
            dataset: {
                getExcerpt(...args: any[]) {
                    getExcerptCall.push(args);
                    return Promise.resolve('getExcerpt Result');
                },
                count(...args: any[]) {
                    countCall.push(args);
                    return Promise.resolve('count Result');
                },
            },
        };
        await getExcerpt(ctx);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(ctx.body).toEqual({
            excerptLines: 'getExcerpt Result',
            totalLoadedLines: 'count Result',
        });
    });
});
