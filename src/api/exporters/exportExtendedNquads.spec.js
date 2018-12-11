import from from 'from';
import exportExtendedNquads from './exportExtendedNquads';

describe('export extended N-Quads', () => {
    it('should export single resource', done => {
        let outputString = '';
        const config = {
            istexQuery: {
                labels: 'query',
                linked: 'language',
                context: {
                    language: 'http://uri/language',
                    title: 'http://uri/title',
                },
            },
        };
        const fields = [
            {
                name: 'istexQuery',
                label: 'query',
                format: {
                    name: 'istex',
                },
            },
            {
                name: 'title',
            },
        ];
        const characteristics = null;
        const resource = {
            uri: 'http://uri',
            title: 'First title',
            istexQuery: 'language.raw:rum',
        };
        exportExtendedNquads(config, fields, characteristics, from([resource]))
            .on('data', data => {
                if (data) outputString += data;
            })
            .on('end', () => {
                const res = outputString.split('\n');
                expect(res).toHaveLength(3);
                expect(res[0]).toEqual(
                    '<https://api.istex.fr/ark:/67375/NDQ-W42TSQDR-H> <http://uri/language> <http://uri> .',
                );
                expect(res[1]).toEqual(
                    '<https://api.istex.fr/ark:/67375/NDQ-W42TSQDR-H> <http://uri/title> "Limba română, limbă romanică" .',
                );
                done();
            })
            .on('error', done);
    });
    // TODO: test when config.istexQuery.context is undefined
});
