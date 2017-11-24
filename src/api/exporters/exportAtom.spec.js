import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import exportAtom from './exportAtom';

describe('exportAtom', () => {
    it('should return a feed', done => {
        let outputString = '';
        const config = {
            cleanHost: 'http://project-study-1',
        };
        const fields = [];
        const characteristics = null;
        exportAtom(config, fields, characteristics, from([{}])).pipe(
            ezs((data, feed) => {
                if (data) {
                    outputString += data;
                } else {
                    feed.close();
                    try {
                        expect(outputString).toContain('<feed xmlns');
                    } catch (e) {
                        return done(e);
                    }
                    return done();
                }
                return feed.end();
            }),
        );
    });

    it('should return a feed containing the last data', done => {
        let outputString = '';
        const config = {
            cleanHost: 'http://project-study-1',
        };
        const fields = [
            { overview: 1, name: 'title' },
            { overview: 2, name: 'description' },
        ];
        const characteristics = null;
        const input = from([
            { uri: 'http://uri ', title: 'Title', description: 'Description' },
        ]);
        exportAtom(config, fields, characteristics, input).pipe(
            ezs((data, feed) => {
                if (data) {
                    outputString += data;
                } else {
                    feed.close();
                    try {
                        expect(outputString).toContain('Title');
                        expect(outputString).toContain('http://uri');
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
