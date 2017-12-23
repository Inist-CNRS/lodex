import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import exportSitemap from './exportSitemap';

describe('exportSitemap', () => {
    it('should return a xml', done => {
        let outputString = '';
        const config = {};
        const fields = [];
        const characteristics = null;
        const input = from([
            {
                uri: 'http://exemple.com',
                publicationDate: Date.now(),
            },
        ]);
        exportSitemap(config, fields, characteristics, input).pipe(
            ezs((data, feed) => {
                if (data) {
                    outputString += data;
                } else {
                    feed.close();
                    try {
                        expect(outputString).toContain(
                            '<loc>http://exemple.com',
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
