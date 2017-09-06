import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import exportJsonld from './exportJsonld';

const fields = [{
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
}];

describe('export jsonLD', () => {
    it('should export simple property', (done) => {
        let outputString = '';
        exportJsonld(
            {
                cleanHost: '',
                schemeForDatasetLink: '',
            },
            fields.slice(0, 1),
            null,
            from([{ uri: 'http://data.istex.fr', Q98n: 'Terminator' }]),
        ).pipe(ezs((data, feed) => {
            if (data !== null) {
                outputString += data;
            } else {
                try {
                    expect(outputString).toEqual('[{"@id":"http://data.istex.fr","@type":"","Q98n":"Terminator","@context":{"Q98n":{"@id":"http://purl.org/dc/terms/title"}}}]');
                } catch (e) {
                    return done(e);
                }
                return done();
            }
            return feed.end();
        }));
    });
});
