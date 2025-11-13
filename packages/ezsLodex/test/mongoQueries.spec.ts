// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
// @ts-expect-error TS(1259): Module '"/home/madeorsk/Cloud/Marmelab/Code/lodex/... Remove this comment to see the full error message
import from from 'from';
// @ts-expect-error TS(1259): Module '"/home/madeorsk/Cloud/Marmelab/Code/lodex/... Remove this comment to see the full error message
import _ from 'lodash';
// @ts-expect-error TS(2792): Cannot find module 'mongodb'. Did you mean to set ... Remove this comment to see the full error message
import { MongoClient } from 'mongodb';
// @ts-expect-error TS(2792): Cannot find module '../src'. Did you mean to set t... Remove this comment to see the full error message
import ezsLodex from '../src';
import { handles } from '../src/mongoDatabase';
// @ts-expect-error TS(2792): Cannot find module './fixture.field.json'. Did you... Remove this comment to see the full error message
import field from './fixture.field.json';
// @ts-expect-error TS(2792): Cannot find module './fixture.publishedCharacteris... Remove this comment to see the full error message
import publishedCharacteristic from './fixture.publishedCharacteristic.json';
// @ts-expect-error TS(2792): Cannot find module './fixture.publishedDataset.jso... Remove this comment to see the full error message
import publishedDataset from './fixture.publishedDataset.json';
// @ts-expect-error TS(2792): Cannot find module './lodexV12.publishedDataset.js... Remove this comment to see the full error message
import publishedDatasetWithSubResource from './lodexV12.publishedDataset.json';
// @ts-expect-error TS(2792): Cannot find module './lodexV14.precomputedDataset.... Remove this comment to see the full error message
import precomputedDataset from './lodexV14.precomputedDataset.json';

ezs.use(ezsLodex);

describe('mongo queries', () => {
    const connectionStringURI = process.env.MONGO_URL;
    let connection: any;
    let db: any;

    // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = connection.db();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterAll'.
    afterAll(async () => {
        await Promise.all(
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            Object.keys(handles).map((key) => handles[key].close()),
        );
        await connection.close();
    });

    // @ts-expect-error TS(6133): 'url' is declared but its value is never read.
    const initDb = (url: any, data: any) => {
        const requests = Object.keys(data).map((col) => {
            const collection = db.collection(col);
            return collection.insertMany(data[col]);
        });
        return Promise.all(requests);
    };

    const drop = () => db.dropDatabase();

    describe('getCharacteristics', () => {
        beforeEach(async () =>
            initDb(connectionStringURI, publishedCharacteristic),
        );
        afterEach(async () => drop());

        it('should return characteristics', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                },
            ])
                // to test disabled instructions: all  actions will not do anything
                .pipe(ezs('LodexContext'))
                .pipe(ezs('LodexConfig'))
                .pipe(ezs('LodexParseQuery'))
                .pipe(ezs('LodexSetField'))
                .pipe(ezs('LodexGetCharacteristics'))
                .on('data', (data: any) => {
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(1);
                    // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
                    expect(res).toEqual([
                        {
                            characteristics: {
                                _id: '5b2cc39cc767d60017eb131f',
                                V99c: 'Jeu de données sur les types de contenu',
                                AtQO:
                                    'Ce jeu correspond au choix de documenter des données ISTEX et plus particulièrement' +
                                    " les types de contenu utilisés dans ISTEX.\r\n \r\nIls ont fait l'objet d'une" +
                                    " homogénéisation opérée par l'équipe ISTEX-DATA et d'un alignement avec le jeu de" +
                                    ' données types de publication. \r\n\r\nCes types permettent de retranscrire la' +
                                    " structuration initiale de l'ouvrage.",
                                gLBB: '/api/run/syndication',
                                G0Ux: 'https://docs.google.com/drawings/d/1rtQ5_GT9QIHKzEjXU5vzSiAnmcu-hdNuyuEArOwUEU4/pub?w=960&h=720',
                                etxw: '2017-10-02',
                                '7IpS': 'LODEX Team',
                                CAhi: 'http://www.istex.fr/wp-content/uploads/2015/02/2015_Licence-type-ISTEX.pdf',
                                PJTS: 'ISTEX',
                                publicationDate: '2018-06-22T09:38:36.475Z',
                            },
                        },
                    ]);
                    done();
                });
        });
    });

    describe('getFields', () => {
        beforeEach(async () => initDb(connectionStringURI, field));
        afterEach(async () => drop());

        it('should return the fields', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                },
            ])
                .pipe(ezs('LodexGetFields'))
                .on('data', (data: any) => {
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(20);
                    // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
                    expect(res[0]).toEqual({
                        fields: {
                            _id: '5b2bd064c767d60017eb130f',
                            cover: 'collection',
                            display_on_list: true,
                            label: 'uri',
                            name: 'uri',
                            position: 0,
                            transformers: [
                                {
                                    args: [
                                        {
                                            name: 'column',
                                            type: 'column',
                                            value: 'uri',
                                        },
                                    ],
                                    operation: 'COLUMN',
                                },
                            ],
                        },
                    });
                    done();
                });
        });
    });

    describe('runQuery', () => {
        beforeEach(async () => initDb(connectionStringURI, publishedDataset));
        afterEach(async () => drop());

        it('should return results', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                },
            ])
                .pipe(ezs('LodexRunQuery'))
                // .pipe(ezs('debug'))
                .on('data', (data: any) => {
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(10);
                    done();
                });
        });

        it('should limit result to one result', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                    limit: 1,
                },
            ])
                .pipe(ezs('LodexRunQuery'))
                // .pipe(ezs('debug'))
                .on('data', (data: any) => {
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(1);
                    done();
                });
        });

        it('should skip results', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                    skip: 9,
                },
            ])
                .pipe(ezs('LodexRunQuery'))
                // .pipe(ezs('debug'))
                .on('data', (data: any) => {
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(1);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0].uri).toBe('ark:/67375/XTP-L5L7X3NF-P');
                    done();
                });
        });

        it('should return the total number of results / 0', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                    filter: { _id: 0 },
                },
            ])
                .pipe(ezs('LodexRunQuery'))
                // .pipe(ezs('debug'))
                .on('data', (data: any) => {
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(1);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0].total).toBe(0);
                    done();
                });
        });

        it('should return the total number of results / 10', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                    limit: 1,
                },
            ])
                .pipe(ezs('LodexRunQuery'))
                // .pipe(ezs('debug'))
                .on('data', (data: any) => {
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(1);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0].total).toBe(10);
                    done();
                });
        });

        it('should return referer', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                    limit: 2,
                    referer: 'referer',
                },
            ])
                .pipe(ezs('LodexRunQuery'))
                // .pipe(ezs('debug'))
                .on('data', (data: any) => {
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(2);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0].total).toBe(10);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0].referer).toBe('referer');
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[1].referer).toBe('referer');
                    done();
                });
        });

        it.skip('should select one field', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                    limit: 2,
                    field: 'uri',
                },
            ])
                .pipe(ezs('LodexRunQuery'))
                // .pipe(ezs('debug'))
                .on('data', (data: any) => {
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(2);
                    // @ts-expect-error TS(2339): Property 'toBeDefined' does not exist on type 'Ass... Remove this comment to see the full error message
                    expect(res[0].uri).toBeDefined();
                    // @ts-expect-error TS(2339): Property 'toBeUndefined' does not exist on type 'A... Remove this comment to see the full error message
                    expect(res[0].versions).toBeUndefined();
                    done();
                });
        });

        it.skip('should select an array of fields', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                    limit: 2,
                    field: ['uri'],
                },
            ])
                .pipe(ezs('LodexRunQuery'))
                .pipe(ezs('debug'))
                .on('data', (data: any) => {
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(2);
                    // @ts-expect-error TS(2339): Property 'toBeDefined' does not exist on type 'Ass... Remove this comment to see the full error message
                    expect(res[0].uri).toBeDefined();
                    // @ts-expect-error TS(2339): Property 'toBeUndefined' does not exist on type 'A... Remove this comment to see the full error message
                    expect(res[0].versions).toBeUndefined();
                    done();
                });
        });
    });

    describe('reduceQuery', () => {
        beforeEach(async () => initDb(connectionStringURI, publishedDataset));
        afterEach(async () => drop());

        it('should throw when no reducer is given', (done) => {
            from([
                {
                    connectionStringURI,
                },
            ])
                .pipe(ezs('LodexReduceQuery'))
                .pipe(ezs('debug'))
                .on('error', (err: any) => {
                    // @ts-expect-error TS(2339): Property 'toBeInstanceOf' does not exist on type '... Remove this comment to see the full error message
                    expect(err).toBeInstanceOf(Error);
                    // @ts-expect-error TS(2551): Property 'toContain' does not exist on type 'Asser... Remove this comment to see the full error message
                    expect(err.message).toContain(
                        'reducer= must be defined as parameter.',
                    );
                    done();
                })
                .on('end', () => {
                    done(new Error('No error was thrown!'));
                });
        });

        it('should throw when the reducer is not found', (done) => {
            from([
                {
                    connectionStringURI,
                },
            ])
                .pipe(ezs('LodexReduceQuery', { reducer: 'foo' }))
                .pipe(ezs('debug'))
                .on('error', (err: any) => {
                    // @ts-expect-error TS(2339): Property 'toBeInstanceOf' does not exist on type '... Remove this comment to see the full error message
                    expect(err).toBeInstanceOf(Error);
                    // @ts-expect-error TS(2551): Property 'toContain' does not exist on type 'Asser... Remove this comment to see the full error message
                    expect(err.message).toContain("Unknown reducer 'foo'");
                    done();
                })
                .on('end', () => {
                    done(new Error('No error was thrown!'));
                });
        });

        it('should take field into account', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                },
            ])
                .pipe(
                    ezs('LodexReduceQuery', {
                        reducer: 'distinct',
                        field: 'publicationDate',
                    }),
                )
                .pipe(ezs.catch())
                .on('error', done)
                .on('data', (data: any) => {
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(2);
                    // @ts-expect-error TS(2339): Property 'toContainEqual' does not exist on type '... Remove this comment to see the full error message
                    expect(res).toContainEqual({
                        _id: '2018-06-22T09:38:36.468Z',
                        total: 2,
                        value: 5,
                    });
                    // @ts-expect-error TS(2339): Property 'toContainEqual' does not exist on type '... Remove this comment to see the full error message
                    expect(res).toContainEqual({
                        _id: '2018-06-22T09:38:36.469Z',
                        total: 2,
                        value: 5,
                    });
                    done();
                });
        });

        it('should take minValue into account', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                },
            ])
                .pipe(
                    ezs('LodexReduceQuery', {
                        reducer: 'distinct',
                        field: 'publicationDate',
                        minValue: 6,
                    }),
                )
                .on('data', (data: any) => {
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(1);
                    // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
                    expect(res).toEqual([{ total: 0 }]);
                    done();
                });
        });

        it('should take maxValue into account', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                },
            ])
                .pipe(
                    ezs('LodexReduceQuery', {
                        reducer: 'distinct',
                        field: 'publicationDate',
                        maxValue: 4,
                    }),
                )
                .on('data', (data: any) => {
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(1);
                    // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
                    expect(res).toEqual([{ total: 0 }]);
                    done();
                });
        });

        it('should inject referer into the results', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                },
            ])
                .pipe(
                    ezs('LodexReduceQuery', {
                        reducer: 'distinct',
                        referer: 'referer',
                    }),
                )
                .on('data', (data: any) => {
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(data).toHaveProperty('referer');
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(10);
                    done();
                });
        });

        describe('count', () => {
            it('should count the fields/resources(?) values', (done) => {
                let res: any = [];
                from([
                    {
                        connectionStringURI,
                    },
                ])
                    .pipe(ezs('LodexReduceQuery', { reducer: 'count' }))
                    .on('data', (data: any) => {
                        res = [...res, data];
                    })
                    .on('end', () => {
                        // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                        expect(res).toHaveLength(1);
                        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
                        expect(res).toEqual([
                            {
                                _id: 'uri',
                                total: 1,
                                value: 10,
                            },
                        ]);
                        done();
                    });
            });
        });

        describe('distinct', () => {
            it('should return the different distinct values', (done) => {
                let res: any = [];
                from([
                    {
                        connectionStringURI,
                    },
                ])
                    .pipe(ezs('LodexReduceQuery', { reducer: 'distinct' }))
                    .on('data', (data: any) => {
                        res = [...res, data];
                    })
                    .on('end', () => {
                        // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                        expect(res).toHaveLength(10);
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(res[0].total).toBe(10);
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(res[0].value).toBe(1);
                        // @ts-expect-error TS(2551): Property 'toMatch' does not exist on type 'Asserti... Remove this comment to see the full error message
                        expect(res[0]._id).toMatch(/^ark:\//);
                        done();
                    });
            });
        });
    });

    describe('injectSyndicationFrom', () => {
        beforeEach(async () =>
            Promise.all([
                initDb(connectionStringURI, publishedDataset),
                initDb(connectionStringURI, field),
            ]),
        );
        afterEach(async () => drop());

        it('should inject title & summary in each item', (done) => {
            const res: any = [];
            from([
                {
                    source: 'ark:/67375/XTP-1JC4F85T-7',
                },
                {
                    source: 'ark:/67375/XTP-HPN7T1Q2-R',
                },
                {
                    source: 'ark:/67375/XTP-HPN7T1Q2-R',
                },
            ])
                .pipe(
                    ezs('injectSyndicationFrom', {
                        connectionStringURI,
                        path: 'source',
                    }),
                )
                .pipe(ezs('debug'))
                .on('data', (data: any) => {
                    res.push(data);
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(3);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0].source).toBe('ark:/67375/XTP-1JC4F85T-7');
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0].source_title).toBe('research-article');
                    // @ts-expect-error TS(2551): Property 'toContain' does not exist on type 'Asser... Remove this comment to see the full error message
                    expect(res[0].source_summary).toContain(
                        'Il s’agit d’une source primaire. ',
                    );
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[1].source).toBe('ark:/67375/XTP-HPN7T1Q2-R');
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[1].source_title).toBe('abstract');
                    // @ts-expect-error TS(2551): Property 'toContain' does not exist on type 'Asser... Remove this comment to see the full error message
                    expect(res[1].source_summary).toContain(
                        'Résumé d’un papier ou ',
                    );
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[2].source).toBe('ark:/67375/XTP-HPN7T1Q2-R');
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[2].source_title).toBe('abstract');
                    // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
                    expect(res[2].source_summary).toEqual(
                        'Résumé d’un papier ou d’une présentation qui a été ' +
                            'présentée ou publiée séparément.',
                    );
                    done();
                });
        });
    });

    describe('injectDatasetFields', () => {
        beforeEach(async () =>
            initDb(connectionStringURI, publishedCharacteristic),
        );
        afterEach(async () => drop());

        it('should inject dataset fiels in each item', (done) => {
            const res: any = [];
            from([
                {
                    item: 1,
                },
                {
                    item: 2,
                },
                {
                    item: 3,
                },
            ])
                .pipe(
                    ezs('injectDatasetFields', {
                        connectionStringURI,
                    }),
                )
                .on('data', (data: any) => {
                    res.push(data);
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(3);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0].item).toBe(1);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0].PJTS).toBe('ISTEX');
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[1].item).toBe(2);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[1].PJTS).toBe('ISTEX');
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[2].item).toBe(3);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[2].PJTS).toBe('ISTEX');
                    done();
                });
        });
    });

    describe('labelizeFieldID', () => {
        beforeEach(async () => initDb(connectionStringURI, field));
        afterEach(async () => drop());

        const input = [
            {
                tfFF: 1,
                BoJb: 'A',
                toto: true,
            },
            {
                tfFF: 2,
                BoJb: 'B',
                toto: true,
            },
            {
                tfFF: 3,
                BoJb: 'C',
                toto: true,
            },
        ];

        it('should labelize each item', (done) => {
            const res: any = [];
            from(input)
                .pipe(
                    ezs('labelizeFieldID', {
                        connectionStringURI,
                    }),
                )
                .on('data', (data: any) => {
                    res.push(data);
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(3);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0].titre).toBe(1);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0]['définition anglais']).toBe('A');
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0].toto).toBe(true);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[1].titre).toBe(2);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[1]['définition anglais']).toBe('B');
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[1].toto).toBe(true);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[2].titre).toBe(3);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[2]['définition anglais']).toBe('C');
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[2].toto).toBe(true);
                    done();
                });
        });

        it('should labelize each item', (done) => {
            const res: any = [];
            from(input)
                .pipe(
                    ezs('labelizeFieldID', {
                        connectionStringURI,
                        suffix: true,
                    }),
                )
                .on('data', (data: any) => {
                    res.push(data);
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(3);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0]['titre - tfFF']).toBe(1);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0]['définition anglais - BoJb']).toBe('A');
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[0].toto).toBe(true);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[1]['titre - tfFF']).toBe(2);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[1]['définition anglais - BoJb']).toBe('B');
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[1].toto).toBe(true);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[2]['titre - tfFF']).toBe(3);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[2]['définition anglais - BoJb']).toBe('C');
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(res[2].toto).toBe(true);
                    done();
                });
        });
    });
    describe('buildContext', () => {
        beforeEach(async () => initDb(connectionStringURI, field));
        afterEach(async () => drop());

        it('with a standard context', (done) => {
            const res: any = [];
            const context = {
                maxSize: '200',
                orderBy: '_id/asc',
                $query: { uri: 'xxx' },
            };
            from([context])
                .pipe(
                    ezs('buildContext', {
                        connectionStringURI,
                    }),
                )
                .pipe(ezs.catch())
                .on('error', done)
                .on('data', (data: any) => {
                    res.push(data);
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(1);
                    // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
                    expect(res[0].maxSize).toEqual(context.maxSize);
                    // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
                    expect(res[0].orderBy).toEqual(context.orderBy);
                    // @ts-expect-error TS(2339): Property 'toBeUndefined' does not exist on type 'A... Remove this comment to see the full error message
                    expect(res[0].$query).toBeUndefined();
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res[0].fields).toHaveLength(20);
                    // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
                    expect(res[0].filter).toEqual({
                        removedAt: {
                            $exists: false,
                        },
                        subresourceId: null,
                        uri: 'xxx',
                    });
                    done();
                });
        });
        it('with a context with field id', (done) => {
            const res: any = [];
            const context = {
                maxSize: '200',
                orderBy: '_id/asc',
                tfFF: ['The Lancet'],
            };
            from([context])
                .pipe(
                    ezs('buildContext', {
                        connectionStringURI,
                    }),
                )
                .pipe(ezs.catch())
                .on('error', done)
                .on('data', (data: any) => {
                    res.push(data);
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(1);
                    // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
                    expect(res[0].maxSize).toEqual(context.maxSize);
                    // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
                    expect(res[0].orderBy).toEqual(context.orderBy);
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res[0].fields).toHaveLength(20);
                    // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
                    expect(res[0].filter).toEqual({
                        removedAt: {
                            $exists: false,
                        },
                        subresourceId: null,
                        $and: [
                            {
                                'versions.tfFF': 'The Lancet',
                            },
                        ],
                    });
                    done();
                });
        });
    });

    describe('countField', () => {
        beforeEach(async () => initDb(connectionStringURI, publishedDataset));
        afterEach(async () => drop());

        it('should return results', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                },
            ])
                .pipe(ezs('LodexRunQuery'))
                .pipe(ezs('filterVersions'))
                .pipe(
                    ezs('injectCountFrom', {
                        connectionStringURI,
                        path: '6gfz',
                        field: '6gfz',
                    }),
                )
                .on('data', (data: any) => {
                    // @ts-expect-error TS(2339): Property 'toBeGreaterThanOrEqual' does not exist o... Remove this comment to see the full error message
                    expect(data['6gfz_count']).toBeGreaterThanOrEqual(1);
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(10);
                    done();
                });
        });
    });

    describe('aggregateQuery', () => {
        beforeEach(async () => initDb(connectionStringURI, publishedDataset));
        afterEach(async () => drop());

        it('should return results', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                },
            ])
                .pipe(
                    ezs('LodexAggregateQuery', {
                        stage: [
                            '$project: { value: { $arrayElemAt: [ "$versions.tfFF", -1 ] } }',
                            '$unwind: "$value"',
                            '$group: { _id: "$value",value: {$sum: 1} }',
                        ],
                    }),
                )
                .pipe(ezs.catch())
                .on('error', done)
                .on('data', (data: any) => {
                    // @ts-expect-error TS(2339): Property 'toBeGreaterThanOrEqual' does not exist o... Remove this comment to see the full error message
                    expect(data.value).toBeGreaterThanOrEqual(1);
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(10);
                    done();
                });
        });

        it('should return results with referer', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                },
            ])
                .pipe(
                    ezs('LodexAggregateQuery', {
                        stage: [
                            '$project: { value: { $arrayElemAt: [ "$versions.tfFF", -1 ] } }',
                            '$unwind: "$value"',
                            '$group: { _id: "$value",value: {$sum: 1} }',
                        ],
                        referer: 'referer',
                    }),
                )
                .pipe(ezs.catch())
                .on('error', done)
                .on('data', (data: any) => {
                    // @ts-expect-error TS(2339): Property 'toBeGreaterThanOrEqual' does not exist o... Remove this comment to see the full error message
                    expect(data.value).toBeGreaterThanOrEqual(1);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(data.referer).toBe('referer');
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(10);
                    done();
                });
        });

        it('should return no results', (done) => {
            let res: any = [];
            from([
                {
                    connectionStringURI,
                    filter: { uri: 'xxxx' },
                },
            ])
                .pipe(
                    ezs('LodexAggregateQuery', {
                        stage: [
                            '$project: { value: { $arrayElemAt: [ "$versions.tfFF", -1 ] } }',
                            'wrong stage',
                            '$unwind: "$value"',
                            '$group: { _id: "$value",value: {$sum: 1} }',
                        ],
                    }),
                )
                .pipe(ezs.catch())
                .on('error', done)
                .on('data', (data: any) => {
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(data.total).toBe(0);
                    res = [...res, data];
                })
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(res).toHaveLength(1);
                    done();
                });
        });

        it('should return error', (done) => {
            from([
                {
                    aaa: 'bbbb',
                },
            ])
                .pipe(
                    ezs('LodexAggregateQuery', {
                        stage: [
                            '$project: { value: { $arrayElemAt: [ "$versions.tfFF", -1 ] } }',
                            'wrong stage',
                            '$unwind: "$value"',
                            '$group: { _id: "$value",value: {$sum: 1} }',
                        ],
                    }),
                )
                .pipe(ezs.catch())
                .pipe(ezs.catch())
                .on('error', (e: any) => {
                    expect(() => {
                        throw e.sourceError;
                        // @ts-expect-error TS(2551): Property 'toThrow' does not exist on type 'Asserti... Remove this comment to see the full error message
                    }).toThrow('Invalid scheme');
                    done();
                })
                .on('end', () => {
                    done(new Error('Error is the right behavior'));
                });
        });
    });

    describe('#joinQuery', () => {
        beforeEach(async () =>
            initDb(connectionStringURI, publishedDatasetWithSubResource),
        );
        afterEach(async () => drop());

        it('should return no results with parameters matchField, matchValue, joinField as empty string', (done) => {
            const results: any = [];
            from([{ connectionStringURI }])
                .pipe(
                    ezs('LodexJoinQuery', {
                        matchField: '',
                        matchValue: '',
                        joinField: '',
                    }),
                )
                .pipe(ezs.catch())
                .on('error', done)
                .on('data', (data: any) => results.push(data))
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(results).toHaveLength(1);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(results[0].total).toBe(0);
                    done();
                });
        });

        it('should return nothing with incomplet parameters', (done) => {
            const results: any = [];
            from([{ connectionStringURI }])
                .pipe(
                    ezs('LodexJoinQuery', {
                        matchField: '',
                        matchValue: '',
                        joinField: 'dqff',
                    }),
                )
                .pipe(ezs.catch())
                .on('error', done)
                .on('data', (data: any) => results.push(data))
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(results).toHaveLength(1);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(results[0].total).toBe(0);
                    done();
                });
        });

        it('should return nothing when searching value that not exists into the dataset', (done) => {
            const results: any = [];
            from([{ connectionStringURI }])
                .pipe(
                    ezs('LodexJoinQuery', {
                        matchField: 'aHOZ',
                        matchValue: 'unset value',
                        joinField: 'dqff',
                    }),
                )
                .pipe(ezs.catch())
                .on('error', done)
                .on('data', (data: any) => results.push(data))
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(results).toHaveLength(1);
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(results[0].total).toBe(0);
                    done();
                });
        });

        it('should return 10 unique sub resources', (done) => {
            const results: any = [];
            const expectedResults = [
                'Boa constrictor',
                'Cebus capucinus',
                'Chlorocebus pygerythrus',
                'Crotalus durissus',
                'Drymarchon corais',
                'Macaca mulatta',
                'Macaca radiata',
                'Otolemur garnettii',
                'Saguinus fuscicollis',
            ];
            from([{ connectionStringURI }])
                .pipe(
                    ezs('LodexJoinQuery', {
                        matchField: 'aHOZ',
                        matchValue: 'Tarsius spectrum',
                        joinField: 'dqff',
                    }),
                )
                .pipe(ezs.catch())
                .on('error', done)
                .on('data', (data: any) => results.push(data))
                .on('end', () => {
                    const uniqResultsSize = _(results)
                        .uniqWith(_.isEqual)
                        .size();

                    const isResultsSameHasExpectedResults = _.chain(results)
                        .map((result: any) => _(result).get('versions[0].dqff'))
                        .difference(expectedResults)
                        .size()
                        .eq(0)
                        .value();

                    const isCountEqualsToOne = _.chain(results)
                        .map((result: any) => _(result).get('count'))
                        .every((value: any) => _.eq(value, 1))
                        .value();

                    const hitsTotal = results.filter(
                        // @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
                        (value) => value.hitsTotal === 1,
                    );

                    // Check if we have 1 document containg this sous-ressources
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(hitsTotal).toHaveLength(9);
                    // Check if all result have the count to 1
                    // @ts-expect-error TS(2339): Property 'toBeTruthy' does not exist on type 'Asse... Remove this comment to see the full error message
                    expect(isCountEqualsToOne).toBeTruthy();
                    // Check if all result a in ExpectedResults list
                    // @ts-expect-error TS(2339): Property 'toBeTruthy' does not exist on type 'Asse... Remove this comment to see the full error message
                    expect(isResultsSameHasExpectedResults).toBeTruthy();
                    // Check the if all element returned are sub ressource
                    // @ts-expect-error TS(2339): Property 'toBeTruthy' does not exist on type 'Asse... Remove this comment to see the full error message
                    expect(_.every(results, 'subresourceId')).toBeTruthy();
                    // Check if we have only unique element
                    // @ts-expect-error TS(2339): Property 'toBeTruthy' does not exist on type 'Asse... Remove this comment to see the full error message
                    expect(uniqResultsSize === results.length).toBeTruthy();
                    // Check if we have 10 uinque element
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(uniqResultsSize).toBe(9);
                    done();
                });
        });

        it('should return 13 sub resources', (done) => {
            const results: any = [];
            const expectedResults = [
                'Alligator mississippiensis',
                'Eublepharis macularius',
                'Mesocricetus auratus',
                'Mus musculus',
                'Rattus norvegicus',
                'Sceloporus occidentalis',
                'Tenebrio molitor',
                'Crocodylus siamensis',
                'Odontochelys semitestacea',
                'Pelodiscus sinensis',
                'Proganochelys quenstedti',
                'Acheta domesticus',
            ];
            from([{ connectionStringURI }])
                .pipe(
                    ezs('LodexJoinQuery', {
                        matchField: 'aHOZ',
                        matchValue: 'Gallus gallus',
                        joinField: 'dqff',
                    }),
                )
                .pipe(ezs.catch())
                .on('error', done)
                .on('data', (data: any) => results.push(data))
                .on('end', () => {
                    const uniqResultsSize = _(results)
                        .uniqWith(_.isEqual)
                        .size();

                    const isResultsSameHasExpectedResults = _.chain(results)
                        .map((result: any) => _(result).get('versions[0].dqff'))
                        .difference(expectedResults)
                        .size()
                        .eq(0)
                        .value();

                    const countEqualsOne = results.filter(
                        // @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
                        (value) => value.count === 1,
                    );
                    const countEqualsTwo = results.filter(
                        // @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
                        (value) => value.count === 2,
                    );

                    const hitsTotal = results.filter(
                        // @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
                        (value) => value.hitsTotal === 2,
                    );

                    // Check if the count are good
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(countEqualsOne).toHaveLength(11);
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(countEqualsTwo).toHaveLength(1);
                    // Check if we have 2 document containg this sous-ressources
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(hitsTotal).toHaveLength(12);
                    // Check if all result a in ExpectedResults list
                    // @ts-expect-error TS(2339): Property 'toBeTruthy' does not exist on type 'Asse... Remove this comment to see the full error message
                    expect(isResultsSameHasExpectedResults).toBeTruthy();
                    // Check the if all element returned are sub ressource
                    // @ts-expect-error TS(2339): Property 'toBeTruthy' does not exist on type 'Asse... Remove this comment to see the full error message
                    expect(_.every(results, 'subresourceId')).toBeTruthy();
                    // Check if we have only unique element
                    // @ts-expect-error TS(2339): Property 'toBeTruthy' does not exist on type 'Asse... Remove this comment to see the full error message
                    expect(uniqResultsSize === results.length).toBeTruthy();
                    // Check if we have 10 uinque element
                    // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                    expect(uniqResultsSize).toBe(12);
                    done();
                });
        });
    });

    describe('runQueryPrecomputed', () => {
        beforeEach(async () => {
            await initDb(connectionStringURI, precomputedDataset);
        });

        afterEach(async () => drop());

        it('should return 5 result for segments precomputed', (done) => {
            const results: any = [];
            from([
                {
                    connectionStringURI,
                    filter: {},
                    precomputedId: 'segments_precomputed',
                    orderBy: 'label/asc',
                },
            ])
                .pipe(
                    ezs('LodexRunQueryPrecomputed', {
                        valueFieldName: 'weight',
                        labelFieldName: 'source',
                    }),
                )
                .pipe(ezs.catch())
                .on('error', done)
                .on('data', (data: any) => results.push(data))
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(results).toHaveLength(5);

                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[0]).toHaveProperty('_id');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[0]).toHaveProperty('total');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[0]).toHaveProperty('source', 'A');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[0]).toHaveProperty('target', 'B');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[0]).toHaveProperty('weight', 10);

                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[1]).toHaveProperty('_id');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[1]).toHaveProperty('total');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[1]).toHaveProperty('source', 'B');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[1]).toHaveProperty('target', 'C');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[1]).toHaveProperty('weight', 30);

                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[2]).toHaveProperty('_id');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[2]).toHaveProperty('total');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[2]).toHaveProperty('source', 'C');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[2]).toHaveProperty('target', 'D');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[2]).toHaveProperty('weight', 42);

                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[3]).toHaveProperty('_id');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[3]).toHaveProperty('total');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[3]).toHaveProperty('source', 'D');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[3]).toHaveProperty('target', 'E');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[3]).toHaveProperty('weight', 67);

                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[4]).toHaveProperty('_id');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[4]).toHaveProperty('total');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[4]).toHaveProperty('source', 'E');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[4]).toHaveProperty('target', 'F');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[4]).toHaveProperty('weight', 88);
                    done();
                });
        });

        it('should return 5 result for values precomputed', (done) => {
            const results: any = [];
            from([
                {
                    connectionStringURI,
                    filter: {},
                    precomputedId: 'values_precomputed',
                    orderBy: 'label/asc',
                },
            ])
                .pipe(
                    ezs('LodexRunQueryPrecomputed', {
                        valueFieldName: 'value',
                        labelFieldName: 'id',
                    }),
                )
                .pipe(ezs.catch())
                .on('error', done)
                .on('data', (data: any) => results.push(data))
                .on('end', () => {
                    // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                    expect(results).toHaveLength(5);

                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[0]).toHaveProperty('_id');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[0]).toHaveProperty('total');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[0]).toHaveProperty('id', 'A');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[0]).toHaveProperty('value', 10);

                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[1]).toHaveProperty('_id');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[1]).toHaveProperty('total');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[1]).toHaveProperty('id', 'B');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[1]).toHaveProperty('value', 30);

                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[2]).toHaveProperty('_id');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[2]).toHaveProperty('total');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[2]).toHaveProperty('id', 'C');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[2]).toHaveProperty('value', 42);

                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[3]).toHaveProperty('_id');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[3]).toHaveProperty('total');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[3]).toHaveProperty('id', 'D');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[3]).toHaveProperty('value', 67);

                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[4]).toHaveProperty('_id');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[4]).toHaveProperty('total');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[4]).toHaveProperty('id', 'E');
                    // @ts-expect-error TS(2551): Property 'toHaveProperty' does not exist on type '... Remove this comment to see the full error message
                    expect(results[4]).toHaveProperty('value', 88);
                    done();
                });
        });

        it(
            'should returns 50 000 documents',
            // @ts-expect-error TS(2769): No overload matches this call.
            (done: any) => {
                const bigPrecomputedDataset = [];

                // Generate 50 000 documents
                for (let i = 0; i < 50000; i++) {
                    bigPrecomputedDataset.push({
                        id: `____${i}_${i}____`,
                        value: `____${i}_${Math.random()}_${i}____`,
                    });
                }

                initDb(connectionStringURI, {
                    pc_big_values_precomputed: bigPrecomputedDataset,
                }).then(() => {
                    const results: any = [];
                    from([
                        {
                            connectionStringURI,
                            filter: {},
                            precomputedId: 'big_values_precomputed',
                            orderBy: 'label/asc',
                        },
                    ])
                        .pipe(
                            ezs('LodexRunQueryPrecomputed', {
                                valueFieldName: 'value',
                                labelFieldName: 'id',
                            }),
                        )
                        .pipe(ezs.catch())
                        .on('error', done)
                        .on('data', (data: any) => results.push(data))
                        .on('end', () => {
                            // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                            expect(results).toHaveLength(50000);
                            done();
                        });
                });
            },
            2 * 60 * 1000, // 2 mins
        );
    });
});
