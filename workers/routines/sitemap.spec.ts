const ezs = require('@ezs/core');
const from = require('from');

test.skip('export an xml', (done) => {
    let outputString = '';
    from([
        {
            uri: 'http://exemple.com',
            publicationDate: Date.now(),
        },
    ])
        .pipe(ezs('delegate', { file: __dirname + '/sitemap.ini' }))
        // @ts-expect-error TS(7006) FIXME: Parameter 'data' implicitly has an 'any' type.
        .on('data', data => {
            if (data) outputString += data;
        })
        .on('end', () => {
            expect(outputString).toContain('<loc>http://exemple.com');
            done();
        })
        .on('error', done);
});
