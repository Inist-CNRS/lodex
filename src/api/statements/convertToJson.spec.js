import ezs from 'ezs';
import from from 'from';
import expect from 'expect';
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
const expectedJson = {};
const ezsLocals = require('.');

const fields = [
    {
        cover: 'collection',
        label: 'title',
        transformers: [
            {
                operation: 'COLUMN',
                args: [
                    {
                        name: 'column',
                        type: 'column',
                        value: 'title',
                    },
                ],
            },
        ],
        scheme: 'http://purl.org/dc/terms/title',
        format: {
            name: 'None',
        },
        display_in_list: true,
        display_in_resource: true,
        searchable: true,
        position: 3,
        name: 'Q98n',
        language: 'fr',
    },
    {
        cover: 'collection',
        label: 'Abstract',
        display_in_list: '',
        display_in_resource: true,
        searchable: true,
        transformers: [
            {
                operation: 'COLUMN',
                args: [
                    {
                        name: 'column',
                        type: 'column',
                        value: 'Ab',
                    },
                ],
            },
        ],
        classes: [],
        position: 12,
        format: {
            args: {
                paragraphWidth: '100%',
            },
            name: 'paragraph',
        },
        count: 500,
        name: 'JDGh',
    },
];

ezs.use(ezsLocals);
describe.only('conversion to json', () => {
    it('should return json from the dataset', done => {
        const stream = from(dataTest).pipe(ezs('convertToJson', { fields }));
        testOne(
            stream,
            data => {
                expect(data).toEqual(expectedJson);
            },
            done,
        );
    });
});
