import ezs from 'ezs';
import from from 'from';
import statements from './index';

ezs.use(statements);

describe('useFieldNames', () => {
    it('should return an empty object when no fieds are given', done => {
        from([{}])
            .pipe(ezs('useFieldNames', {}))
            .pipe(
                ezs(output => {
                    try {
                        expect(output).toEqual({});
                        done();
                    } catch (e) {
                        done(e);
                    }
                }),
            );
    });

    it('should return an empty object when no data is passed', done => {
        from([{}])
            .pipe(
                ezs('useFieldNames', {
                    fields: ['a', 'b'],
                }),
            )
            .pipe(
                ezs(output => {
                    try {
                        expect(output).toEqual({});
                        done();
                    } catch (e) {
                        done(e);
                    }
                }),
            );
    });

    it('should return an empty object when no matching cover', done => {
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
                ezs(output => {
                    try {
                        expect(output).toEqual({});
                        done();
                    } catch (e) {
                        done(e);
                    }
                }),
            );
    });

    it('should return the matching field value', done => {
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
                ezs(output => {
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

    it('should return only the matching field value', done => {
        const res = [];
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
                ezs((output, feed) => {
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

    it('should return all matching fields', done => {
        const res = [];
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
                ezs((output, feed) => {
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
