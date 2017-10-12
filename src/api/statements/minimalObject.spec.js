import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import statements from './index';
import testOne from './testOne';

ezs.use(statements);

describe('minimalObject', () => {
    it('should throw when no title scheme', (done) => {
        from([{
            uri: 'http://uri',
            title: 'Title',
        }])
            .pipe(ezs('minimalObject', {
                fields: [{
                    cover: 'collection',
                    overview: 1,
                    name: 'title',
                }],
            }))
            .pipe(ezs((input) => {
                try {
                    expect(input).toEqual({ _id: 'http://uri', value: 'Title' });
                    done(new Error('should not work'));
                } catch (e) {
                    done();
                }
            }));
    });

    it('should return the correct feed', (done) => {
        const stream = from([{
            uri: 'http://uri',
            title: 'Title',
        }])
            .pipe(ezs('minimalObject', {
                fields: [{
                    cover: 'collection',
                    overview: 1,
                    name: 'title',
                    scheme: 'http://purl.org/dc/terms/title',
                }],
            }));
        testOne(
            stream,
            (input) => {
                expect(input).toEqual({ _id: 'http://uri', value: 'Title' });
            },
            done);
    });
});
