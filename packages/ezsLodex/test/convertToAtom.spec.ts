// @ts-expect-error TS(1259): Module '"/home/madeorsk/Cloud/Marmelab/Code/lodex/... Remove this comment to see the full error message
import from from 'from';
// @ts-expect-error TS(2792): Cannot find module 'feed'. Did you mean to set the... Remove this comment to see the full error message
import { Feed } from 'feed';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
// @ts-expect-error TS(2792): Cannot find module '../src'. Did you mean to set t... Remove this comment to see the full error message
import statements from '../src';

ezs.use(statements);

describe('convertToAtom', () => {
    const fields = [
        { overview: 1, name: 'title' },
        { overview: 2, name: 'description' },
    ];
    let atomFeed: any;

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
            .pipe(
                ezs((input: any) => {
                    try {
                        const lines = input.split('\n');
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[0]).toBe(
                            '<?xml version="1.0" encoding="utf-8"?>',
                        );
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[1]).toBe(
                            '<feed xmlns="http://www.w3.org/2005/Atom">',
                        );
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[2]).toBe('    <id>id</id>');
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[3]).toBe('    <title>title</title>');
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[5]).toBe(
                            '    <generator>Lodex</generator>',
                        );
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[6]).toBe(
                            '    <link rel="alternate" href="link"/>',
                        );
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[7]).toBe(
                            '    <logo>https://user-images.githubusercontent.com/7420853/30152932-1794db3c-93b5-11e7-98ab-a7f28d0061cb.png</logo>',
                        );
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[8]).toBe('</feed>');
                        done();
                    } catch (e) {
                        done(e);
                    }
                }),
            )
            .on('error', done);
    });

    it('should return the correct feed from one resource', (done) => {
        from([
            {
                uri: 'http://uri',
                title: 'Title',
                description: 'Description.',
            },
        ])
            .pipe(ezs('convertToAtom', { fields, config: {}, atomFeed }))
            .pipe(
                ezs((input: any) => {
                    try {
                        const lines = input.split('\n');
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[0]).toBe(
                            '<?xml version="1.0" encoding="utf-8"?>',
                        );
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[1]).toBe(
                            '<feed xmlns="http://www.w3.org/2005/Atom">',
                        );
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[2]).toBe('    <id>id</id>');
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[3]).toBe('    <title>title</title>');
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[5]).toBe(
                            '    <generator>Lodex</generator>',
                        );
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[6]).toBe(
                            '    <link rel="alternate" href="link"/>',
                        );
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[7]).toBe(
                            '    <logo>https://user-images.githubusercontent.com/7420853/30152932-1794db3c-93b5-11e7-98ab-a7f28d0061cb.png</logo>',
                        );
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[8]).toBe('    <entry>');
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[9]).toBe(
                            '        <title type="html"><![CDATA[Title]]></title>',
                        );
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[10]).toBe('        <id>http://uri</id>');
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[11]).toBe(
                            '        <link href="http://uri"/>',
                        );
                        // @ts-expect-error TS(2551): Property 'toContain' does not exist on type 'Asser... Remove this comment to see the full error message
                        expect(lines[12]).toContain('<updated>');
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[13]).toBe(
                            '        <summary type="html"><![CDATA[Description.]]></summary>',
                        );
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[14]).toBe('    </entry>');
                        // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                        expect(lines[15]).toBe('</feed>');
                        done();
                    } catch (e) {
                        done(e);
                    }
                }),
            )
            .on('error', done);
    });

    it('should return the correct feed from two resources', (done) => {
        from([
            {
                uri: 'http://uri/1',
                title: 'Title',
                description: 'Description.',
            },
            {
                uri: 'http://uri/2',
                title: 'Title',
                description: 'Is it present?',
            },
        ])
            .pipe(ezs('convertToAtom', { fields, config: {}, atomFeed }))
            .pipe(
                ezs((input: any) => {
                    try {
                        const lines = input.split('\n');
                        // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                        expect(lines).toHaveLength(23);
                        done();
                    } catch (e) {
                        done(e);
                    }
                }),
            )
            .on('error', done);
    });
});
