import from from 'from';
import exportExtendedNquads from './exportExtendedNquads';

describe('export extended N-Quads', () => {
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

    it('should export single resource', done => {
        let outputString = '';
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

    it('should export two resources', done => {
        let outputString = '';
        const resources = [
            {
                uri: 'http://uri/1',
                title: 'First title',
                istexQuery: 'language.raw:rum',
            },
            {
                uri: 'http://uri/2',
                title: 'Second title',
                istexQuery: 'language.raw:san',
            },
        ];
        exportExtendedNquads(config, fields, characteristics, from(resources))
            .on('data', data => {
                if (data) outputString += data;
            })
            .on('end', () => {
                const res = outputString.split('\n');
                expect(res).toHaveLength(5);
                expect(res[0]).toEqual(
                    '<https://api.istex.fr/ark:/67375/NDQ-W42TSQDR-H> <http://uri/language> <http://uri/1> .',
                );
                expect(res[1]).toEqual(
                    '<https://api.istex.fr/ark:/67375/NDQ-W42TSQDR-H> <http://uri/title> "Limba română, limbă romanică" .',
                );
                expect(res[2]).toEqual(
                    '<https://api.istex.fr/ark:/67375/6ZK-VMC2N7W5-9> <http://uri/language> <http://uri/2> .',
                );
                expect(res[3]).toEqual(
                    '<https://api.istex.fr/ark:/67375/6ZK-VMC2N7W5-9> <http://uri/title> "fables of Pilpay, a famous Indian phylosopher" .',
                );
                done();
            })
            .on('error', done);
    });

    // TODO: test when config.istexQuery.context is undefined
});
