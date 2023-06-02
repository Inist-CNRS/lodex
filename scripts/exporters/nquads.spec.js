// @ts-nocheck
const ezs = require('@ezs/core');
const from = require('from');

const localConfig = {
    cleanHost: '',
    schemeForDatasetLink: '',
};

const fields = [
    {
        cover: 'collection',
        scheme: 'http://purl.org/dc/terms/title',
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
    {
        cover: 'dataset',
        scheme: 'http://purl.org/dc/terms/title',
        name: 'qW6w',
    },
];

test.skip('export a single data property', done => {
    let outputString = '';
    from([{ uri: 'http://data.istex.fr', Q98n: 'Terminator' }])
        .pipe(ezs('delegate', { file: __dirname + '/nquads.ini' }, { fields: fields.slice(0, 1) }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\n');
            expect(res).toEqual(['<http://data.istex.fr> <http://purl.org/dc/terms/title> "Terminator" .', '']);
            done();
        })
        .on('error', done);
});

test.skip('export an object property (with a class)', done => {
    let outputString = '';
    from([{
        uri: 'http://uri/1',
        propa: 'label a',
        propb: 'value 2',
    }])
        .pipe(ezs('delegate', { file: __dirname + '/nquads.ini' }, { fields: fields.slice(1, 3) }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\n');
            expect(res).toEqual([
                '<http://uri/1#compose/propa> <http://property/b> "value 2" .',
                '<http://uri/1#compose/propa> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://class/2> .',
                '<http://uri/1> <http://property/a> <http://uri/1#compose/propa> .',
                '',
            ]);
            done();
        })
        .on('error', done);
});

test.skip('export a composed object property (with a class)', done => {
    let outputString = '';
    from([{
        uri: 'http://uri/1',
        propcomposed: 'label a',
        propb: 'value 1',
        propc: 'value 2',
    }])
        .pipe(ezs('delegate', { file: __dirname + '/nquads.ini' }, {
            fields: [
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
            ]
        }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\n');
            expect(res).toEqual([
                '<http://uri/1#compose/propcomposed> <http://property/b> "value 1" .',
                '<http://uri/1#compose/propcomposed> <http://property/c> "value 2" .',
                '<http://uri/1#compose/propcomposed> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://class/composed> .',
                '<http://uri/1> <http://property/composed> <http://uri/1#compose/propcomposed> .',
                '',
            ]);
            done();
        })
        .on('error', done);
});

test.skip('don\'t export a single data property without value', done => {
    let outputString = '';
    from([{ uri: 'http://data.istex.fr', Q98n: null }])
        .pipe(ezs('delegate', { file: __dirname + '/nquads.ini' }, { fields: fields.slice(0, 1) }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            expect(outputString).toEqual('');
            done();
        })
        .on('error', done);
});

test.skip('export a composed object property (with a class) without number in sub-domain', done => {
    let outputString = '';
    from([{
        uri: 'http://a-b-1.c.d.e/1',
        propcomposed: 'label a',
        propb: 'value 1',
        propc: 'value 2',
    }])
        .pipe(ezs('delegate', { file: __dirname + '/nquads.ini' }, {
            fields: [
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
            ]
        }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\n');
            expect(res).toEqual([
                '<http://a-b.c.d.e/1#compose/propcomposed> <http://property/b> "value 1" .',
                '<http://a-b.c.d.e/1#compose/propcomposed> <http://property/c> "value 2" .',
                '<http://a-b.c.d.e/1#compose/propcomposed> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://class/composed> .',
                '<http://a-b.c.d.e/1> <http://property/composed> <http://a-b.c.d.e/1#compose/propcomposed> .',
                '',
            ]);
            done();
        })
        .on('error', done);
});

test.skip('export an annotating property without number in sub-domain', done => {
    let outputString = '';
    from([{
        uri: 'http://a-b-1.c.d.e/1',
        completed: 'La chimie minérale (= inorganique) étudie ...',
        completing: [
            'https://fr.wikipedia.org/wiki/Chimie_inorganique',
        ],
    }])
        .pipe(ezs('delegate', { file: __dirname + '/nquads.ini' }, {
            fields: [
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
            ]
        }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\n');
            expect(outputString).toContain('#complete/');
            const completing = RegExp('#complete/([^>]*)').exec(
                outputString,
            )[1];
            expect(res).toEqual([
                `<http://a-b.c.d.e/1#complete/${completing}> <http://purl.org/dc/terms/source> <https://fr.wikipedia.org/wiki/Chimie_inorganique> .`,
                `<http://a-b.c.d.e/1#complete/${completing}> <http://www.w3.org/2000/01/rdf-schema#label> "La chimie minérale (= inorganique) étudie ..." .`,
                `<http://a-b.c.d.e/1> <http://purl.org/dc/terms/description> <http://a-b.c.d.e/1#complete/${completing}> .`,
                '',
            ]);
            done();
        })
        .on('error', done);
});

test.skip('export a single data property with dataset', done => {
    let outputString = '';
    from([{ uri: 'http://resource.uri', Q98n: 'Terminator', qW6w: 'Dataset Title' }])
        .pipe(ezs('delegate', { file: __dirname + '/nquads.ini' }, {
            cleanHost: 'http://dataset.uri',
            exportDataset: 'true',
            schemeForDatasetLink: 'http://scheme.for.dataset/link',
            datasetClass: 'http://test.fr/datasetClass',
            collectionClass: 'http://collection.class',
            fields: [
                {
                    cover: 'collection',
                    scheme: 'http://purl.org/dc/terms/title',
                    name: 'Q98n',
                },
                {
                    cover: 'dataset',
                    scheme: 'http://purl.org/dc/terms/title',
                    name: 'qW6w',
                },
            ],
            characteristics: [{
                qW6w: 'Dataset Title',
            }]
        }))
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            const res = outputString.split('\n');
            expect(res).toEqual([
                '<http://dataset.uri> <http://purl.org/dc/terms/title> "Dataset Title" .',
                '<http://dataset.uri> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://test.fr/datasetClass> .',
                '<http://resource.uri> <http://purl.org/dc/terms/title> "Terminator" .',
                '<http://resource.uri> <http://scheme.for.dataset/link> <http://dataset.uri> .',
                '<http://resource.uri> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://collection.class> .',
                ''
            ]);
            done();
        })
        .on('error', done);
});
