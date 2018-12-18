import ezs from 'ezs';
import from from 'from';
import testOne from './testOne';

const dataTest = [
    {
        lodex: { uri: 'http://localhost:3000/ark:/67375/RZL-F4841DSB-1' },
        content: {
            arkIstex: 'ark:/67375/6H6-N49F7FRR-Q',
            doi: ['10.1006/jmaa.2001.7542'],
            fulltext: [
                {
                    extension: 'pdf',
                    original: true,
                    mimetype: 'application/pdf',
                    uri:
                        'https://api.istex.fr/document/9AA9EE9B75A6067C28F8119813504932FFD3D5A1/fulltext/pdf',
                },
                {
                    extension: 'zip',
                    original: false,
                    mimetype: 'application/zip',
                    uri:
                        'https://api.istex.fr/document/9AA9EE9B75A6067C28F8119813504932FFD3D5A1/fulltext/zip',
                },
            ],
        },
    },
];
const expectedJsonLd = {
    '@context': {
        'categories.inist': {
            '@id': 'https://data.istex.fr/ontology/istex#subjectInist',
            '@type': '@id',
        },
        doi: 'http://purl.org/ontology/bibo/doi',
        'fulltext[0].uri': 'https://data.istex.fr/ontology/istex#accessURL',
    },
    '@graph': [
        {
            arkIstex: 'ark:/67375/6H6-N49F7FRR-Q',
            doi: ['10.1006/jmaa.2001.7542'],
            fulltext: [
                {
                    extension: 'pdf',
                    mimetype: 'application/pdf',
                    original: true,
                    uri:
                        'https://api.istex.fr/document/9AA9EE9B75A6067C28F8119813504932FFD3D5A1/fulltext/pdf',
                },
                {
                    extension: 'zip',
                    mimetype: 'application/zip',
                    original: false,
                    uri:
                        'https://api.istex.fr/document/9AA9EE9B75A6067C28F8119813504932FFD3D5A1/fulltext/zip',
                },
            ],
            '@id': 'https://api.istex.fr/ark:/67375/6H6-N49F7FRR-Q',
            'categories.inist':
                'http://localhost:3000/ark:/67375/RZL-F4841DSB-1',
            'fulltext[0].uri': {
                '@id':
                    'https://api.istex.fr/document/9AA9EE9B75A6067C28F8119813504932FFD3D5A1/fulltext/pdf',
            },
        },
    ],
};
const ezsLocals = require('.');

const config = {
    istexQuery: {
        labels: '',
        linked: 'categories.inist',
        context: {
            'categories.inist':
                'https://data.istex.fr/ontology/istex#subjectInist',
            doi: 'http://purl.org/ontology/bibo/doi',
            'fulltext[0].uri': 'https://data.istex.fr/ontology/istex#accessURL',
        },
    },
};

ezs.use(ezsLocals);
describe('conversion to extended JSON-LD', () => {
    it('should return nquads from the dataset', done => {
        const stream = from(dataTest).pipe(
            ezs('convertToExtendedJsonLd', { config }),
        );
        testOne(
            stream,
            data => {
                expect(data).toEqual(expectedJsonLd);
            },
            done,
        );
    });
});
