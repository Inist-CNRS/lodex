const fs = require('fs');
const ezs = require('@ezs/core');

describe('zip.ini', () => {
    it('should unzip a zip file containing JSON files', done => {
        // @ts-expect-error TS(7034) FIXME: Variable 'res' implicitly has type 'any[]' in some... Remove this comment to see the full error message
        const res = [];
        fs.createReadStream(__dirname + '/fixture-10.zip')
            .pipe(ezs('delegate', { file: __dirname + '/zip-raw.ini' }))
            // @ts-expect-error TS(7006) FIXME: Parameter 'chunk' implicitly has an 'any' type.
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res.length).toEqual(10);
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(typeof res[0]).toEqual('object');
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res[0].arkIstex).toBe('ark:/67375/56L-Z1WPCL8D-T');
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res[0].title).toBe(
                    'A case of diabetes, with an historical sketch of that disease. By Thomas Girdlestone, M.D.',
                );
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res[0].language).toBe('["eng"]');
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res[0].publicationDate).toBe('1799');
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res[0].corpusName).toBe('ecco');
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(JSON.parse(res[0].qualityIndicators).score).toEqual(
                    0.062,
                );
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res[9].arkIstex).toBe('ark:/67375/0T8-SLF4HPPC-X');
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res[9].title).toBe(
                    'Breath acetone concentration decreases with blood glucose concentration in type I diabetes mellitus patients during hypoglycaemic clamps',
                );
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res[9].language).toBe('["eng"]');
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res[9].publicationDate).toBe('2009');
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res[9].corpusName).toBe('iop');
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(JSON.parse(res[9].qualityIndicators).score).toEqual(
                    8.247,
                );
                done();
            });
    });
});
