import from from 'from';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
import statements from '../src';

ezs.use(statements);

describe('useFieldNames', () => {
    it('should return an empty object when no fieds are given', (done: any) => {
        from([{}])
            .pipe(ezs('useFieldNames', {}))
            .pipe(
                ezs((output: any) => {
                    try {
                        expect(output).toEqual({});
                        done();
                    } catch (e) {
                        done(e);
                    }
                }),
            );
    });

    it('should return an empty object when no data is passed', (done: any) => {
        from([{}])
            .pipe(
                ezs('useFieldNames', {
                    fields: ['a', 'b'],
                }),
            )
            .pipe(
                ezs((output: any) => {
                    try {
                        expect(output).toEqual({});
                        done();
                    } catch (e) {
                        done(e);
                    }
                }),
            );
    });

    it('should return an empty object when no matching cover', (done: any) => {
        from([{}])
            .pipe(
                ezs('useFieldNames', {
                    fields: [
                        {
                            cover: 'dataset',
                        },
                    ],
                }),
            )
            .pipe(
                ezs((output: any) => {
                    try {
                        expect(output).toEqual({});
                        done();
                    } catch (e) {
                        done(e);
                    }
                }),
            );
    });

    it('should return the matching field value', (done: any) => {
        from([
            {
                matching: 'data',
            },
        ])
            .pipe(
                ezs('useFieldNames', {
                    fields: [
                        {
                            name: 'matching',
                            cover: 'collection',
                        },
                    ],
                }),
            )
            .pipe(
                ezs((output: any) => {
                    try {
                        expect(output).toEqual({
                            matching: 'data',
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                }),
            );
    });

    it('should return only the matching field value', (done: any) => {
        const res: any = [];
        from([
            {
                matching: 'data',
                nomatching: 'data too',
            },
        ])
            .pipe(
                ezs('useFieldNames', {
                    fields: [
                        {
                            name: 'matching',
                            cover: 'collection',
                        },
                    ],
                }),
            )
            .pipe(
                ezs((output: any, feed: any) => {
                    if (output) {
                        res.push(output);
                        return feed.end();
                    }
                    expect(res).toEqual([
                        {
                            matching: 'data',
                        },
                    ]);
                    return done();
                }),
            );
    });

    it('should return all matching fields', (done: any) => {
        const res: any = [];
        from([
            {
                matching: 'data',
                nomatching: 'nodata',
            },
            {
                matching: 'data2',
            },
        ])
            .pipe(
                ezs('useFieldNames', {
                    fields: [
                        {
                            name: 'matching',
                            cover: 'collection',
                        },
                    ],
                }),
            )
            .pipe(
                ezs((output: any, feed: any) => {
                    if (output) {
                        res.push(output);
                        return feed.end();
                    }
                    expect(res).toEqual([
                        {
                            matching: 'data',
                        },
                        {
                            matching: 'data2',
                        },
                    ]);
                    return done();
                }),
            );
    });
});
