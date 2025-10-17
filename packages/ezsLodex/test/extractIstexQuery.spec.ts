// @ts-expect-error TS(1259): Module '"/home/madeorsk/Cloud/Marmelab/Code/lodex/... Remove this comment to see the full error message
import from from 'from';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
// @ts-expect-error TS(2792): Cannot find module '../src'. Did you mean to set t... Remove this comment to see the full error message
import statements from '../src';

ezs.use(statements);

describe('extractIstexQuery', () => {
    it('should return when no istexQuery', (done) => {
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

    it('should return a query', (done) => {
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
                        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
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

    it('should return a query with expanded scheme', (done) => {
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
                        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
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

    it('should return a query without instance number', (done) => {
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
                        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
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
