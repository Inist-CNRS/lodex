import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import exportAtom from './exportAtom';

describe('exportAtom', () => {
    it('should return a feed', (done) => {
        let outputString = '';
        const config = {
            cleanHost: 'http://project-study-1',
        };
        const fields = [];
        const characteristics = null;
        exportAtom(
            config,
            fields,
            characteristics,
            from([{}]),
        ).pipe(ezs((data, feed) => {
            if (data) {
                outputString += data;
            } else {
                try {
                    expect(outputString).toInclude('<feed xmlns');
                } catch (e) {
                    return done(e);
                }
                return done();
            }
            return feed.end();
        }));
    });
});
