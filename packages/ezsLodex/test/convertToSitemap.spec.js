import from from 'from';
import ezs from '@ezs/core';
import statements from '../src';
import testOne from './testOne';

ezs.use(statements);

describe('convertToSitemap', () => {
    it('should not error when no input', (done) => {
        from([])
            .pipe(ezs('convertToSitemap'))
            .on('data', () => done(new Error('should not return data')))
            .on('end', done);
    });

    it('should output when one resource', (done) => {
        const stream = from([{
            uri: 'http://uri/1',
            publicationDate: Date.now(),
        }])
            .pipe(ezs('convertToSitemap'));
        testOne(
            stream,
            (data) => {
                expect(data).toMatch(/^<\?/);
            },
            done,
        );
    });

    it('should output a sitemap when one resource', (done) => {
        let str = '';
        from([{
            uri: 'http://uri/1',
            publicationDate: Date.now(),
        }])
            .pipe(ezs('convertToSitemap'))
            // .pipe(ezs('debug'))
            .on('data', (chunk) => {
                expect(typeof chunk).toBe('string');
                str += chunk;
            })
            .on('end', () => {
                const res = str.split('\n');
                expect(res.length).toBe(2);
                expect(res[0]).toBe('<?xml version="1.0"?>');
                // eslint-disable-next-line max-len
                expect(res[1]).toMatch(/^<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"><url><loc>http:\/\/uri\/1<\/loc><lastmod>[0-9]+<\/lastmod><changefreq>monthly<\/changefreq><priority>1<\/priority><\/url><\/urlset>$/);
                done();
            });
    });

    it('should output a sitemap when 2 resources', (done) => {
        let str = '';
        from([{
            uri: 'http://uri/1',
            publicationDate: Date.now(),
        }, {
            uri: 'http://uri/2',
            publicationDate: Date.now(),
        }])
            .pipe(ezs('convertToSitemap'))
            // .pipe(ezs('debug'))
            .on('data', (chunk) => {
                expect(typeof chunk).toBe('string');
                str += chunk;
            })
            .on('end', () => {
                const res = str.split('\n');
                expect(res.length).toBe(2);
                expect(res[0]).toBe('<?xml version="1.0"?>');
                // eslint-disable-next-line max-len
                expect(res[1]).toMatch(/^<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"><url><loc>http:\/\/uri\/1<\/loc><lastmod>[0-9]+<\/lastmod><changefreq>monthly<\/changefreq><priority>1<\/priority><\/url><url><loc>http:\/\/uri\/2<\/loc><lastmod>[0-9]+<\/lastmod><changefreq>monthly<\/changefreq><priority>1<\/priority><\/url><\/urlset>$/);
                done();
            });
    });
});
