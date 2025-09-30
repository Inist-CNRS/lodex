import from from 'from';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
import statements from '../src';

ezs.use(statements);

describe('extractIstexQuery', () => {
    it('should return when no istexQuery', (done: any) => {
        from([{}])
            .pipe(
                ezs('extractIstexQuery', {
                    fields: [],
                }),
            )
            .on('data', () => {
                done(new Error('should return null'));
            })
            .on('end', done);
    });

    it('should return a query', (done: any) => {
        from([
            {
                uri: 'http://uri',
                istexQuery: 'dumb',
            },
        ])
            .pipe(
                ezs('extractIstexQuery', {
                    fields: [
                        {
                            name: 'istexQuery',
                            scheme: 'istex:query',
                        },
                    ],
                }),
            )
            .pipe(
                ezs((output: any) => {
                    try {
                        expect(output).toEqual({
                            content: 'dumb',
                            lodex: {
                                uri: 'http://uri',
                            },
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                }),
            );
    });

    it('should return a query with expanded scheme', (done: any) => {
        from([
            {
                uri: 'http://uri',
                istexQuery: 'dumb',
            },
        ])
            .pipe(
                ezs('extractIstexQuery', {
                    fields: [
                        {
                            name: 'istexQuery',
                            scheme: 'https://data.istex.fr/ontology/istex#query',
                        },
                    ],
                }),
            )
            .pipe(
                ezs((output: any) => {
                    try {
                        expect(output).toEqual({
                            content: 'dumb',
                            lodex: {
                                uri: 'http://uri',
                            },
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                }),
            );
    });

    it('should return a query without instance number', (done: any) => {
        from([
            {
                uri: 'http://p-s-1.uri',
                istexQuery: 'dumb',
            },
        ])
            .pipe(
                ezs('extractIstexQuery', {
                    fields: [
                        {
                            name: 'istexQuery',
                            scheme: 'istex:query',
                        },
                    ],
                }),
            )
            .pipe(
                ezs((output: any) => {
                    try {
                        expect(output).toEqual({
                            content: 'dumb',
                            lodex: {
                                uri: 'http://p-s.uri',
                            },
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                }),
            );
    });
});
