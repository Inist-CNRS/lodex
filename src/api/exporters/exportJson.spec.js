import ezs from 'ezs';
import from from 'from';
import exportJson from './exportJson';

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

describe('export json', () => {
    it('should export single resource', done => {
        let outputString = '';
        exportJson(
            {},
            fields.slice(0, 2),
            null,
            from([
                {
                    uri: 'http://data.istex.fr',
                    Q98n: 'Terminator',
                    JDGh: 'Description',
                },
            ]),
        ).pipe(
            ezs((data, feed) => {
                if (data !== null) {
                    outputString += data;
                } else {
                    try {
                        expect(outputString).toEqual(
                            '[{"uri":"http://data.istex.fr","fields":[{"name":"Q98n","value":"Terminator","label":"title","language":"fr"},{"name":"JDGh","value":"Description","label":"Abstract"}]}]',
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
