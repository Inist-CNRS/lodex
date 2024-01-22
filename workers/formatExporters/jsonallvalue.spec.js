const ezs = require('@ezs/core');
const from = require('from');

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

test.skip('export single resource', done => {
    let outputString = '';
    from([
        {
            uri: 'http://data.istex.fr',
            Q98n: 'Terminator',
            JDGh: 'Description',
        },
    ])
        .pipe(
            ezs(
                'delegate',
                { file: __dirname + '/jsonallvalue.ini' },
                { localConfig: {}, fields },
            ),
        )
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            expect(outputString).toEqual(
                '[{"uri":"http://data.istex.fr","fields":[{"name":"Q98n","value":"Terminator","label":"title","language":"fr"},{"name":"JDGh","value":"Description","label":"Abstract"}]}]',
            );
            done();
        })
        .on('error', done);
});
