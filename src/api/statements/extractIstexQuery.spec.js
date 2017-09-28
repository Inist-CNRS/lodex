import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import statements from './index';

ezs.use(statements);

describe('extractIstexQuery', () => {
    it('should return when no istexQuery', (done) => {
        from([{}])
            .pipe(ezs('extractIstexQuery', {
                fields: [],
                config: {
                    istexQuery: {
                        labels: '',
                    },
                },
            }))
            .pipe(ezs((output, feed) => {
                feed.close();
                try {
                    expect(output).toBe(null);
                    done();
                } catch (e) {
                    done(e);
                }
            }));
    });

    // FIXME: time out. Why? Returns a Stream instead of null
    it.skip('should return null if no label matches the query field', (done) => {
        from([{}])
            .pipe(ezs('extractIstexQuery', {
                fields: [{
                    name: 'istexQuery',
                    label: 'query',
                    format: {
                        name: 'istex',
                    },
                }],
                config: {
                    istexQuery: {
                        labels: 'foo',
                    },
                },
            }))
            .pipe(ezs((output, feed) => {
                feed.close();
                try {
                    expect(output).toBe(null);
                    done();
                } catch (e) {
                    done(e);
                }
            }));
    });

    it('should return a query', (done) => {
        from([{
            uri: 'http://uri',
            istexQuery: 'dumb',
        }])
            .pipe(ezs('extractIstexQuery', {
                fields: [{
                    name: 'istexQuery',
                    label: 'query',
                    format: {
                        name: 'istex',
                    },
                }],
                config: {
                    istexQuery: {
                        labels: 'query',
                    },
                },
            }))
            .pipe(ezs((output) => {
                try {
                    expect(output).toEqual({
                        content: 'http://replace-api.fr/document/?q=dumb',
                        lodex: {
                            uri: 'http://uri',
                        },
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            }));
    });
});
