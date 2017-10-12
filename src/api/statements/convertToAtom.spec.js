import fs from 'fs';
import path from 'path';
import expect from 'expect';
import Feed from 'feed';
import ezs from 'ezs';
import statements from './index';

ezs.use(statements);

describe('convertToAtom', () => {
    it('should return the correct feed', (done) => {
        const atomFeed = new Feed({
            title: 'title',
            generator: 'Lodex',
            id: 'id',
            link: 'link',
            image: 'https://user-images.githubusercontent.com/7420853/30152932-1794db3c-93b5-11e7-98ab-a7f28d0061cb.png',
        });
        const mongoData = fs.createReadStream(path.resolve(__dirname, './fixture.data.mongo.json'));
        mongoData
            .pipe(ezs('convertToAtom', { fields: [], config: {}, atomFeed }))
            .pipe(ezs((input) => {
                try {
                    expect(input.split('\n')[0]).toBe('<?xml version="1.0" encoding="utf-8"?>');
                    expect(input.split('\n')[1]).toBe('<feed xmlns="http://www.w3.org/2005/Atom">');
                    expect(input.split('\n')[2]).toBe('    <id>id</id>');
                    expect(input.split('\n')[3]).toBe('    <title>title</title>');
                    expect(input.split('\n')[5]).toBe('    <generator>Lodex</generator>');
                    expect(input.split('\n')[6]).toBe('    <link rel="alternate" href="link"/>');
                    expect(input.split('\n')[7]).toBe('    <logo>https://user-images.githubusercontent.com/7420853/30152932-1794db3c-93b5-11e7-98ab-a7f28d0061cb.png</logo>');
                    expect(input.split('\n')[8]).toBe('</feed>');
                    done();
                } catch (e) {
                    done(e);
                }
            }));
        mongoData.on('error', done);
    });
});
