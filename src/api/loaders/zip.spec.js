import fs from 'fs';
import ezs from 'ezs';

describe('zip.ini', () => {
    it('should unzip a zip file containing JSON files', done => {
        const res = [];
        fs.createReadStream(__dirname + '/fixture-10.zip')
            .pipe(ezs('delegate', { file: __dirname + '/zip.ini' }))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res.length).toEqual(10);
                expect(typeof res[0]).toEqual('object');
                expect(res[0].arkIstex).toBe('ark:/67375/56L-Z1WPCL8D-T');
                expect(res[0].title).toBe(
                    'A case of diabetes, with an historical sketch of that disease. By Thomas Girdlestone, M.D.',
                );
                expect(res[0].language).toBe('["eng"]');
                expect(res[0].publicationDate).toBe('1799');
                expect(res[0].corpusName).toBe('ecco');
                expect(JSON.parse(res[0].qualityIndicators).score).toEqual(
                    0.062,
                );
                expect(res[9].arkIstex).toBe('ark:/67375/0T8-SLF4HPPC-X');
                expect(res[9].title).toBe(
                    // eslint-disable-next-line max-len
                    'Breath acetone concentration decreases with blood glucose concentration in type I diabetes mellitus patients during hypoglycaemic clamps',
                );
                expect(res[9].language).toBe('["eng"]');
                expect(res[9].publicationDate).toBe('2009');
                expect(res[9].corpusName).toBe('iop');
                expect(JSON.parse(res[9].qualityIndicators).score).toEqual(
                    8.247,
                );
                done();
            });
    });
});
