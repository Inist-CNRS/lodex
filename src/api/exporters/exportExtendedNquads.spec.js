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

    it('should export single resource with more documents', done => {
        let outputString = '';
        const resource = {
            uri: 'http://uri/cat',
            title: 'First title',
            istexQuery: 'language.raw:cat',
        };
        exportExtendedNquads(config, fields, characteristics, from([resource]))
            .on('data', data => {
                if (data) outputString += data;
            })
            .on('end', () => {
                const res = outputString.split('\n');
                expect(res).toHaveLength(19);
                /* data have changed!
                expect(res).toEqual([
                    '<https://api.istex.fr/ark:/67375/6H6-NTDRQKJZ-W> <http://uri/language> <http://uri/cat> .',
                    '<https://api.istex.fr/ark:/67375/6H6-NTDRQKJZ-W> <http://uri/title> "Diferncies socials en el cncer de bufeta urinria a Catalunya" .',
                    '<https://api.istex.fr/ark:/67375/WNG-QK4K9FN2-3> <http://uri/language> <http://uri/cat> .',
                    '<https://api.istex.fr/ark:/67375/WNG-QK4K9FN2-3> <http://uri/title> "JOSEPH SILK: The Big Bang. The Creation and Evolution of the Universe. W. H. Freeman and Company, San Francisco, 1980. 394 + X Seiten. Preis $4.90." .',
                    '<https://api.istex.fr/ark:/67375/WNG-7S1DTV7P-G> <http://uri/language> <http://uri/cat> .',
                    '<https://api.istex.fr/ark:/67375/WNG-7S1DTV7P-G> <http://uri/title> "J. HEIUMANN : Relativistic Cosmology. An Introduction. Springer‐Verlag, Berlin, Heidelbcrg, New York, 1980. XI1 + 168 Seitcn, Preis DM 48. ‐." .',
                    '<https://api.istex.fr/ark:/67375/WNG-JCTCNPC8-S> <http://uri/language> <http://uri/cat> .',
                    '<https://api.istex.fr/ark:/67375/WNG-JCTCNPC8-S> <http://uri/title> "ROBERT K. NESBET: Variational Methods in Electron ‐ Atom Scattering Theory. Plenum Press, New York and London, 1980. 228 Seiten, ISBN 0‐306‐40413‐3. Preis: US $32.50." .',
                    '<https://api.istex.fr/ark:/67375/6H6-8V6QFS7V-9> <http://uri/language> <http://uri/cat> .',
                    '<https://api.istex.fr/ark:/67375/6H6-8V6QFS7V-9> <http://uri/title> "La mortalitat a catalunya: descripci i, comparaci per edat i sexe" .',
                    '',
                ]);
                */
                done();
            })
            .on('error', done);
    });

    // TODO: test when config.istexQuery.context is undefined
});
