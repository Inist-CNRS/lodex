import from from 'from';
import ezs from '@ezs/core';
import statements from '../statements/';

ezs.use(statements);

describe('JSONLDObject', () => {
    it('should return an empty array given an empty input', (done) => {
        const res = [];
        from([])
            .pipe(ezs('JSONLDObject'))
            .on('data', (data) => {
                expect(data).toEqual(expect.any(Object));
                res.push(data);
            })
            .on('end', () => {
                expect(res).toEqual([]);
                done();
            })
            .on('error', done);
    });

    it('should return one object for one given resource', (done) => {
        const res = [];
        from([{
            uri: 'http://uri/1',
            title: 'Title',
        }])
            .pipe(ezs('JSONLDObject', {
                fields: [{
                    name: 'title',
                }],
            }))
            .on('data', (data) => {
                expect(data).toEqual(expect.any(Object));
                res.push(data);
            })
            .on('end', () => {
                expect(res).toEqual([{
                    '@id': 'http://uri/1',
                }]);
                done();
            })
            .on('error', done);
    });

    it('should return two objects for two given resources', (done) => {
        const res = [];
        from([{
            uri: 'http://uri/1',
            title: 'Title',
        }, {
            uri: 'http://uri/2',
            title: 'Second title',
        }])
            .pipe(ezs('JSONLDObject', {
                fields: [{
                    name: 'title',
                }],
            }))
            .on('data', (data) => {
                expect(data).toEqual(expect.any(Object));
                res.push(data);
            })
            .on('end', () => {
                expect(res).toEqual([{
                    '@id': 'http://uri/1',
                }, {
                    '@id': 'http://uri/2',
                }]);
                done();
            })
            .on('error', done);
    });

    it('should return one object with title', (done) => {
        const res = [];
        from([{
            uri: 'http://uri/1',
            title: 'Title',
        }])
            .pipe(ezs('JSONLDObject', {
                fields: [{
                    name: 'title',
                    cover: 'collection',
                    scheme: 'http://ontology/title',
                    type: 'type',
                }],
            }))
            .on('data', (data) => {
                expect(data).toEqual(expect.any(Object));
                res.push(data);
            })
            .on('end', () => {
                expect(res).toEqual([{
                    '@id': 'http://uri/1',
                    '@context': {
                        title: {
                            '@id': 'http://ontology/title',
                            '@type': 'type',
                        },
                    },
                    title: 'Title',
                }]);
                done();
            })
            .on('error', done);
    });

    it('should return two objects with title', (done) => {
        const res = [];
        from([{
            uri: 'http://uri/1',
            title: 'Title',
        }, {
            uri: 'http://uri/2',
            title: 'Second title',
        }])
            .pipe(ezs('JSONLDObject', {
                fields: [{
                    name: 'title',
                    cover: 'collection',
                    scheme: 'http://ontology/title',
                    type: 'type',
                }],
            }))
            .on('data', (data) => {
                expect(data).toEqual(expect.any(Object));
                res.push(data);
            })
            .on('end', () => {
                expect(res).toEqual([{
                    '@id': 'http://uri/1',
                    '@context': {
                        title: {
                            '@id': 'http://ontology/title',
                            '@type': 'type',
                        },
                    },
                    title: 'Title',
                }, {
                    '@id': 'http://uri/2',
                    '@context': {
                        title: {
                            '@id': 'http://ontology/title',
                            '@type': 'type',
                        },
                    },
                    title: 'Second title',
                }]);
                done();
            })
            .on('error', done);
    });

    it('should return dataset properties', (done) => {
        const res = [];
        from([{
            uri: 'http://uri/1',
            title: 'Title',
        }])
            .pipe(ezs('JSONLDObject', {
                fields: [{
                    name: 'title',
                    cover: 'dataset',
                    scheme: 'http://ontology/title',
                    type: 'type',
                }],
                characteristics: [{
                    title: 'titleCharacteristics',
                }],
                exportDataset: 'true',
            }))
            .on('data', (data) => {
                expect(data).toEqual(expect.any(Object));
                res.push(data);
            })
            .on('end', () => {
                expect(res).toEqual([
                    {
                        '@id': 'http://uri/1',
                        dataset: {
                            '@context': {
                                title: {
                                    '@id': 'http://ontology/title',
                                    '@type': 'type',
                                },
                            },
                            title: 'titleCharacteristics',
                        },
                    },
                ]);
                done();
            })
            .on('error', done);
    });

    it('should return collection class', (done) => {
        const res = [];
        from([{
            uri: 'http://uri/1',
            title: 'Title',
        }])
            .pipe(ezs('JSONLDObject', {
                fields: [{
                    name: 'title',
                    cover: 'collection',
                    scheme: 'http://ontology/title',
                    type: 'type',
                }],
                collectionClass: 'http://collection/class',
            }))
            .on('data', (data) => {
                expect(data).toEqual(expect.any(Object));
                res.push(data);
            })
            .on('end', () => {
                expect(res).toEqual([{
                    '@id': 'http://uri/1',
                    '@context': {
                        title: {
                            '@id': 'http://ontology/title',
                            '@type': 'type',
                        },
                    },
                    '@type': 'http://collection/class',
                    title: 'Title',
                }]);
                done();
            })
            .on('error', done);
    });

    it('should return classes', (done) => {
        const res = [];
        from([{
            uri: 'http://uri/1',
            title: 'Title',
        }])
            .pipe(ezs('JSONLDObject', {
                fields: [{
                    name: 'title',
                    cover: 'collection',
                    scheme: 'http://ontology/title',
                    type: 'type',
                    classes: ['http://field/class'],
                }],
            }))
            .on('data', (data) => {
                expect(data).toEqual(expect.any(Object));
                res.push(data);
            })
            .on('end', () => {
                expect(res).toEqual([{
                    '@id': 'http://uri/1',
                    '@context': {
                        label: {
                            '@id': 'http://www.w3.org/2000/01/rdf-schema#label',
                        },
                        title: {
                            '@id': 'http://ontology/title',
                            '@type': 'type',
                        },
                    },
                    title: {
                        '@id': 'http://uri/1#classes/title',
                        '@type': ['http://field/class'],
                        label: 'Title',
                    },
                }]);
                done();
            })
            .on('error', done);
    });

    it('should return one object with composed field', (done) => {
        const res = [];
        from([{
            uri: 'http://uri/1',
            address: 'Address',
            zip: '00000',
            town: 'TOWN',
        }])
            .pipe(ezs('JSONLDObject', {
                fields: [{
                    name: 'address',
                    cover: 'collection',
                    scheme: 'http://ontology/address',
                    composedOf: {
                        fields: ['zip', 'town'],
                    },
                }, {
                    name: 'zip',
                    cover: 'collection',
                    scheme: 'http://ontology/zip',
                }, {
                    name: 'town',
                    cover: 'collection',
                    scheme: 'http://ontology/town',
                }],
            }))
            .on('data', (data) => {
                expect(data).toEqual(expect.any(Object));
                res.push(data);
            })
            .on('end', () => {
                expect(res).toEqual([{
                    '@id': 'http://uri/1',
                    '@context': {
                        address: {
                            '@id': 'http://ontology/address',
                        },
                        label: {
                            '@id': 'http://www.w3.org/2000/01/rdf-schema#label',
                        },
                        town: {
                            '@id': 'http://ontology/town',
                        },
                        zip: {
                            '@id': 'http://ontology/zip',
                        },
                    },
                    address: [{
                        '@id': 'http://uri/1#compose/address',
                        '@type': [],
                        zip: '00000',
                    }, {
                        '@id': 'http://uri/1#compose/address',
                        '@type': [],
                        town: 'TOWN',
                    }],
                }]);
                done();
            })
            .on('error', done);
    });

    it('should return annotating (completing) fields', (done) => {
        const res = [];
        from([{
            uri: 'http://uri/1',
            description: 'Description',
            source: 'http://source',
        }])
            .pipe(ezs('JSONLDObject', {
                fields: [{
                    name: 'description',
                    cover: 'collection',
                    scheme: 'http://ontology/description',
                    type: 'type',
                }, {
                    name: 'source',
                    cover: 'collection',
                    scheme: 'http://ontology/source',
                    completes: 'description',
                }],
            }))
            .on('data', (data) => {
                expect(data).toEqual(expect.any(Object));
                res.push(data);
            })
            .on('end', () => {
                expect(res).toHaveLength(1);
                const name = Object.keys(res[0]).find((k) => !['@id', '@context'].includes(k));
                const expected = [{
                    '@id': 'http://uri/1',
                    '@context': {
                        description: {
                            '@id': 'http://www.w3.org/2000/01/rdf-schema#label',
                            '@type': 'type',
                        },
                        source: {
                            '@id': 'http://ontology/source',
                        },
                    },
                }];
                expected[0]['@context'][name] = {
                    '@id': 'http://ontology/description',
                };
                expected[0][name] = {
                    '@id': `http://uri/1#complete/${name}`,
                    description: 'Description',
                    source: {
                        '@id': 'http://source',
                    },
                };
                expect(res).toEqual(expected);
                done();
            })
            .on('error', done);
    });
});
