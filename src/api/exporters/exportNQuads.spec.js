import ezs from 'ezs';
import from from 'from';
import exportNQuads from './exportNQuads';

const fields = [
    {
        cover: 'collection',
        scheme: 'http://purl.org/dc/terms/title',
        format: {
            name: 'None',
        },
        name: 'Q98n',
    },
    {
        cover: 'collection',
        scheme: 'http://property/a',
        name: 'propa',
        classes: ['http://class/2'],
        composedOf: {
            fields: ['propb'],
        },
    },
    {
        cover: 'collection',
        scheme: 'http://property/b',
        name: 'propb',
    },
];

describe('export Nquads', () => {
    it('should export a single data property', done => {
        let outputString = '';
        exportNQuads(
            {
                cleanHost: '',
                schemeForDatasetLink: '',
            },
            fields.slice(0, 1),
            null,
            from([{ uri: 'http://data.istex.fr', Q98n: 'Terminator' }]),
        ).pipe(
            ezs((data, feed) => {
                if (data !== null) {
                    outputString += data;
                } else {
                    try {
                        expect(outputString).toEqual(
                            '<http://data.istex.fr> <http://purl.org/dc/terms/title> "Terminator" .\n',
                        );
                    } catch (e) {
                        return done(e);
                    }
                    return done();
                }
                return feed.end();
            }),
        );
    });

    it('should export an object property (with a class)', done => {
        let outputString = '';
        exportNQuads(
            {
                cleanHost: '',
                schemeForDatasetLink: '',
            },
            fields.slice(1, 3),
            null,
            from([
                {
                    uri: 'http://uri/1',
                    propa: 'label a',
                    propb: 'value 2',
                },
            ]),
        ).pipe(
            ezs((data, feed) => {
                if (data !== null) {
                    outputString += data;
                } else {
                    try {
                        expect(outputString).toEqual(
                            [
                                '<http://uri/1#compose/propa> <http://property/b> "value 2" .',
                                '<http://uri/1#compose/propa> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://class/2> .',
                                '<http://uri/1> <http://property/a> <http://uri/1#compose/propa> .',
                                '',
                            ].join('\n'),
                        );
                    } catch (e) {
                        return done(e);
                    }
                    return done();
                }
                return feed.end();
            }),
        );
    });

    it('should export a composed object property (with a class)', done => {
        let outputString = '';
        exportNQuads(
            {
                cleanHost: '',
                schemeForDatasetLink: '',
            },
            [
                {
                    cover: 'collection',
                    scheme: 'http://property/composed',
                    name: 'propcomposed',
                    classes: ['http://class/composed'],
                    composedOf: {
                        fields: ['propb', 'propc'],
                    },
                },
                {
                    cover: 'collection',
                    scheme: 'http://property/b',
                    name: 'propb',
                },
                {
                    cover: 'collection',
                    scheme: 'http://property/c',
                    name: 'propc',
                },
            ],
            null,
            from([
                {
                    uri: 'http://uri/1',
                    propcomposed: 'label a',
                    propb: 'value 1',
                    propc: 'value 2',
                },
            ]),
        ).pipe(
            ezs((data, feed) => {
                if (data !== null) {
                    outputString += data;
                } else {
                    try {
                        expect(outputString).toEqual(
                            [
                                '<http://uri/1#compose/propcomposed> <http://property/b> "value 1" .',
                                '<http://uri/1#compose/propcomposed> <http://property/c> "value 2" .',
                                '<http://uri/1#compose/propcomposed> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://class/composed> .',
                                '<http://uri/1> <http://property/composed> <http://uri/1#compose/propcomposed> .',
                                '',
                            ].join('\n'),
                        );
                    } catch (e) {
                        return done(e);
                    }
                    return done();
                }
                return feed.end();
            }),
        );
    });

    it('should not export a single data property without value', done => {
        let outputString = '';
        exportNQuads(
            {
                cleanHost: '',
                schemeForDatasetLink: '',
            },
            fields.slice(0, 1),
            null,
            from([{ uri: 'http://data.istex.fr', Q98n: null }]),
        ).pipe(
            ezs((data, feed) => {
                if (data !== null) {
                    outputString += data;
                } else {
                    try {
                        expect(outputString).toEqual('');
                    } catch (e) {
                        return done(e);
                    }
                    return done();
                }
                return feed.end();
            }),
        );
    });

    it('should export a composed object property (with a class) without number in sub-domain', done => {
        let outputString = '';
        exportNQuads(
            {
                cleanHost: '',
                schemeForDatasetLink: '',
            },
            [
                {
                    cover: 'collection',
                    scheme: 'http://property/composed',
                    name: 'propcomposed',
                    classes: ['http://class/composed'],
                    composedOf: {
                        fields: ['propb', 'propc'],
                    },
                },
                {
                    cover: 'collection',
                    scheme: 'http://property/b',
                    name: 'propb',
                },
                {
                    cover: 'collection',
                    scheme: 'http://property/c',
                    name: 'propc',
                },
            ],
            null,
            from([
                {
                    uri: 'http://a-b-1.c.d.e/1',
                    propcomposed: 'label a',
                    propb: 'value 1',
                    propc: 'value 2',
                },
            ]),
        ).pipe(
            ezs((data, feed) => {
                if (data !== null) {
                    outputString += data;
                } else {
                    try {
                        expect(outputString).toEqual(
                            [
                                '<http://a-b.c.d.e/1#compose/propcomposed> <http://property/b> "value 1" .',
                                '<http://a-b.c.d.e/1#compose/propcomposed> <http://property/c> "value 2" .',
                                '<http://a-b.c.d.e/1#compose/propcomposed> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://class/composed> .',
                                '<http://a-b.c.d.e/1> <http://property/composed> <http://a-b.c.d.e/1#compose/propcomposed> .',
                                '',
                            ].join('\n'),
                        );
                    } catch (e) {
                        return done(e);
                    }
                    return done();
                }
                return feed.end();
            }),
        );
    });

    it('should export an annotating property without number in sub-domain', done => {
        let outputString = '';
        exportNQuads(
            {
                cleanHost: '',
                schemeForDatasetLink: '',
            },
            [
                {
                    cover: 'collection',
                    scheme: 'http://purl.org/dc/terms/description',
                    name: 'completed',
                },
                {
                    cover: 'collection',
                    scheme: 'http://purl.org/dc/terms/source',
                    completes: 'completed',
                    name: 'completing',
                },
            ],
            null,
            from([
                {
                    uri: 'http://a-b-1.c.d.e/1',
                    completed: 'La chimie minérale (= inorganique) étudie ...',
                    completing: [
                        'https://fr.wikipedia.org/wiki/Chimie_inorganique',
                    ],
                },
            ]),
        ).pipe(
            ezs((data, feed) => {
                if (data !== null) {
                    outputString += data;
                } else {
                    try {
                        expect(outputString).toContain('#complete/');
                        const completing = RegExp('#complete/([^>]*)').exec(
                            outputString,
                        )[1];
                        expect(outputString).toEqual(
                            [
                                /*eslint-disable prettier/prettier */
`<http://a-b.c.d.e/1#complete/${completing}> <http://purl.org/dc/terms/source> <https://fr.wikipedia.org/wiki/Chimie_inorganique> .`,
`<http://a-b.c.d.e/1#complete/${completing}> <http://www.w3.org/2000/01/rdf-schema#label> "La chimie minérale (= inorganique) étudie ..." .`,
`<http://a-b.c.d.e/1> <http://purl.org/dc/terms/description> <http://a-b.c.d.e/1#complete/${completing}> .`,
'',
                                /*eslint-enable prettier/prettier */
                            ].join('\n'),
                        );
                    } catch (e) {
                        return done(e);
                    }
                    return done();
                }
                return feed.end();
            }),
        );
    });
});
