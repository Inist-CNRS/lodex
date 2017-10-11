import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import statements from './index';

ezs.use(statements);

describe('minimalObject', () => {
    it('should return the correct feed', (done) => {
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
                    done();
                } catch (e) {
                    done(e);
                }
            }));
    });
});
