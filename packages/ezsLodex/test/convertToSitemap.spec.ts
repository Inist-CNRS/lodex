import from from 'from';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
import statements from '../src';
import testOne from './testOne';

ezs.use(statements);

describe('convertToSitemap', () => {
    it('should not error when no input', (done: any) => {
        from([])
            .pipe(ezs('convertToSitemap'))
            .on('data', () => done(new Error('should not return data')))
            .on('end', done);
    });

    it('should output when one resource', (done: any) => {
        const stream = from([
            {
                uri: 'http://uri/1',
                publicationDate: Date.now(),
            },
        ]).pipe(ezs('convertToSitemap'));
        testOne(
            stream,
            (data: any) => {
                expect(data).toMatch(/^<\?/);
            },
            done,
        );
    });

    it('should output a sitemap when one resource', (done: any) => {
        let str = '';
        from([
            {
                uri: 'http://uri/1',
                publicationDate: Date.now(),
            },
        ])
            .pipe(ezs('convertToSitemap'))
            // .pipe(ezs('debug'))
            .on('data', (chunk: any) => {
                expect(typeof chunk).toBe('string');
                str += chunk;
            })
            .on('end', () => {
                const res = str.split('\n');
                expect(res).toHaveLength(2);
                expect(res[0]).toBe('<?xml version="1.0"?>');

                expect(res[1]).toMatch(
                    /^<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"><url><loc>http:\/\/uri\/1<\/loc><lastmod>[0-9]+<\/lastmod><changefreq>monthly<\/changefreq><priority>1<\/priority><\/url><\/urlset>$/,
                );
                done();
            });
    });

    it('should output a sitemap when 2 resources', (done: any) => {
        let str = '';
        from([
            {
                uri: 'http://uri/1',
                publicationDate: Date.now(),
            },
            {
                uri: 'http://uri/2',
                publicationDate: Date.now(),
            },
        ])
            .pipe(ezs('convertToSitemap'))
            // .pipe(ezs('debug'))
            .on('data', (chunk: any) => {
                expect(typeof chunk).toBe('string');
                str += chunk;
            })
            .on('end', () => {
                const res = str.split('\n');
                expect(res).toHaveLength(2);
                expect(res[0]).toBe('<?xml version="1.0"?>');

                expect(res[1]).toMatch(
                    /^<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"><url><loc>http:\/\/uri\/1<\/loc><lastmod>[0-9]+<\/lastmod><changefreq>monthly<\/changefreq><priority>1<\/priority><\/url><url><loc>http:\/\/uri\/2<\/loc><lastmod>[0-9]+<\/lastmod><changefreq>monthly<\/changefreq><priority>1<\/priority><\/url><\/urlset>$/,
                );
                done();
            });
    });
});
