import expect from 'expect';
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
    },
];

describe.only('export json', () => {
    it('should export simple property', done => {
        let outputString = '';
        exportJson(
            {},
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
                            '[{"uri":"http://data.istex.fr","title":"Terminator"}]',
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
