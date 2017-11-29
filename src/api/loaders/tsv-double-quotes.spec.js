import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import tsvDoubleQuotes from './tsv-double-quotes';
import testAll from '../statements/testAll';

describe('loader tsv-double-quotes', () => {
    it('should parse normal TSV', done => {
        const parseTsvDoubleQuotes = tsvDoubleQuotes({});
        parseTsvDoubleQuotes(from(['a\tb\n1\t2\n'])).pipe(
            ezs(data => {
                try {
                    expect(data).toEqual({ a: '1', b: '2' });
                } catch (e) {
                    return done(e);
                }
                return done();
            }),
        );
    });

    it('should parse TSV according to the header', done => {
        const parseTsvDoubleQuotes = tsvDoubleQuotes({});
        const stream = parseTsvDoubleQuotes(from(['a\tb\n1\t2\n3\t4\n']));
        testAll(
            stream,
            data => {
                expect(data).toContainKeys(['a', 'b']);
                expect(data).toNotContainKey('c');
            },
            done,
        );
    });

    it('should parse two lines TSV', done => {
        const parseTsvDoubleQuotes = tsvDoubleQuotes({});
        const stream = parseTsvDoubleQuotes(from(['a\tb\n1\t2\n3\t4\n']));
        let count = 0;
        stream.pipe(
            ezs((data, feed) => {
                if (data === null) {
                    try {
                        expect(count).toBe(2);
                    } catch (e) {
                        return done(e);
                    }
                    return done();
                }
                count = count + 1;
                return feed.end();
            }),
        );
    });

    it('should parse two lines of double quoted TSV', done => {
        const parseTsvDoubleQuotes = tsvDoubleQuotes({});
        const stream = parseTsvDoubleQuotes(
            from(['a\tb\n1\t"2\n2.5"\n3\t4\n']),
        );
        let count = 0;
        stream.pipe(
            ezs((data, feed) => {
                if (data === null) {
                    try {
                        expect(count).toBe(2);
                    } catch (e) {
                        return done(e);
                    }
                    return done();
                }
                count = count + 1;
                return feed.end();
            }),
        );
    });
});
