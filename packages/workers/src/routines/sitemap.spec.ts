import from from 'from';
// @ts-expect-error TS7016
import ezs from '@ezs/core';

test.skip('export an xml', (done) => {
    let outputString = '';
    from([
        {
            uri: 'http://exemple.com',
            publicationDate: Date.now(),
        },
    ])
        .pipe(ezs('delegate', { file: __dirname + '/sitemap.ini' }))
        .on('data', (data: any) => {
            if (data) outputString += data;
        })
        .on('end', () => {
            expect(outputString).toContain('<loc>http://exemple.com');
            done();
        })
        .on('error', done);
});
