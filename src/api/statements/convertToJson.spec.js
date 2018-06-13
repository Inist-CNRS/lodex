import ezs from 'ezs';
import from from 'from';
import expect from 'expect';
import testOne from './testOne';

const dataTest = [
    {
        uri: 'http://data.istex.fr',
        Q98n: 'Terminator',
        JDGh: 'Description',
    },
];
const expectedJson = {
    uri: 'http://data.istex.fr',
    fields: [
        {
            name: 'Q98n',
            value: 'Terminator',
            label: 'title',
            language: 'fr',
        },
        {
            name: 'JDGh',
            value: 'Description',
            label: 'Abstract',
            language: undefined,
        },
    ],
};
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
