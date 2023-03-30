import from from 'from';
import { Feed } from 'feed';
import ezs from '@ezs/core';
import statements from '../statements/';

ezs.use(statements);

describe('convertToAtom', () => {
    const fields = [
        { overview: 1, name: 'title' },
        { overview: 2, name: 'description' },
    ];
    let atomFeed;

    beforeEach(() => {
        atomFeed = new Feed({
            title: 'title',
            generator: 'Lodex',
            id: 'id',
            link: 'link',
            image: 'https://user-images.githubusercontent.com/7420853/30152932-1794db3c-93b5-11e7-98ab-a7f28d0061cb.png',
        });
    });

    it('should return the correct feed from empty data', (done) => {
        from([{}])
            .pipe(ezs('convertToAtom', { fields: [], config: {}, atomFeed }))
            .pipe(ezs((input) => {
                try {
                    const lines = input.split('\n');
                    expect(lines[0]).toBe('<?xml version="1.0" encoding="utf-8"?>');
                    expect(lines[1]).toBe('<feed xmlns="http://www.w3.org/2005/Atom">');
                    expect(lines[2]).toBe('    <id>id</id>');
                    expect(lines[3]).toBe('    <title>title</title>');
                    expect(lines[5]).toBe('    <generator>Lodex</generator>');
                    expect(lines[6]).toBe('    <link rel="alternate" href="link"/>');
                    expect(lines[7]).toBe('    <logo>https://user-images.githubusercontent.com/7420853/30152932-1794db3c-93b5-11e7-98ab-a7f28d0061cb.png</logo>');
                    expect(lines[8]).toBe('</feed>');
                    done();
                } catch (e) {
                    done(e);
                }
            }))
            .on('error', done);
    });

    it('should return the correct feed from one resource', (done) => {
        from([{
            uri: 'http://uri',
            title: 'Title',
            description: 'Description.',
        }])
            .pipe(ezs('convertToAtom', { fields, config: {}, atomFeed }))
            .pipe(ezs((input) => {
                try {
                    const lines = input.split('\n');
                    expect(lines[0]).toBe('<?xml version="1.0" encoding="utf-8"?>');
                    expect(lines[1]).toBe('<feed xmlns="http://www.w3.org/2005/Atom">');
                    expect(lines[2]).toBe('    <id>id</id>');
                    expect(lines[3]).toBe('    <title>title</title>');
                    expect(lines[5]).toBe('    <generator>Lodex</generator>');
                    expect(lines[6]).toBe('    <link rel="alternate" href="link"/>');
                    expect(lines[7]).toBe('    <logo>https://user-images.githubusercontent.com/7420853/30152932-1794db3c-93b5-11e7-98ab-a7f28d0061cb.png</logo>');
                    expect(lines[8]).toBe('    <entry>');
                    expect(lines[9]).toBe('        <title type="html"><![CDATA[Title]]></title>');
                    expect(lines[10]).toBe('        <id>http://uri</id>');
                    expect(lines[11]).toBe('        <link href="http://uri"/>');
                    expect(lines[12]).toContain('<updated>');
                    expect(lines[13]).toBe('        <summary type="html"><![CDATA[Description.]]></summary>');
                    expect(lines[14]).toBe('    </entry>');
                    expect(lines[15]).toBe('</feed>');
                    done();
                } catch (e) {
                    done(e);
                }
            }))
            .on('error', done);
    });

    it('should return the correct feed from two resources', (done) => {
        from([{
            uri: 'http://uri/1',
            title: 'Title',
            description: 'Description.',
        }, {
            uri: 'http://uri/2',
            title: 'Title',
            description: 'Is it present?',
        }])
            .pipe(ezs('convertToAtom', { fields, config: {}, atomFeed }))
            .pipe(ezs((input) => {
                try {
                    const lines = input.split('\n');
                    expect(lines.length).toBe(23);
                    done();
                } catch (e) {
                    done(e);
                }
            }))
            .on('error', done);
    });
});
