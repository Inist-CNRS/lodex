import path from 'path';
import { getSiteTitle, injectSiteTitle, renderPublic } from './front';
import { getTheme } from './themes';

jest.mock('./themes', () => ({ getTheme: jest.fn() }));

describe('getSiteTitle', () => {
    const themeVariables = { siteTitle: 'Titre a modifier' };

    it('should return the site title set by the admin', () => {
        expect(getSiteTitle(themeVariables, { siteTitle: ' My site ' })).toBe(
            'My site',
        );
    });

    it('should ignore the theme placeholder, an empty value or no config', () => {
        expect(
            getSiteTitle(themeVariables, { siteTitle: 'Titre a modifier' }),
        ).toBeNull();
        expect(getSiteTitle(themeVariables, { siteTitle: '  ' })).toBeNull();
        expect(getSiteTitle(themeVariables, undefined)).toBeNull();
        expect(getSiteTitle(undefined, undefined)).toBeNull();
    });

    it('should read `title` for themes that declare it (ISTEX)', () => {
        expect(
            getSiteTitle(
                { title: 'exemple : Services' },
                { title: 'Mon corpus', siteTitle: 'Other theme title' },
            ),
        ).toBe('Mon corpus');
    });
});

describe('injectSiteTitle', () => {
    const html = '<html><head><title>Lodex - CNRS</title></head></html>';

    it('should leave the page untouched without a site title', () => {
        expect(injectSiteTitle(html, null)).toBe(html);
    });

    it('should replace the page title and expose it to the public app', () => {
        expect(injectSiteTitle(html, 'My site')).toBe(
            '<html><head><title>My site</title><script>window.__SITE_TITLE__ = "My site";</script></head></html>',
        );
    });

    it('should escape the title in both places', () => {
        const result = injectSiteTitle(html, '</script><b>$& "x"');
        expect(result).toContain(
            '<title>&lt;/script&gt;&lt;b&gt;$&amp; &quot;x&quot;</title>',
        );
        expect(result).toContain(
            'window.__SITE_TITLE__ = "\\u003c/script>\\u003cb>$& \\"x\\"";',
        );
    });
});

describe('renderPublic', () => {
    beforeEach(() => {
        (getTheme as jest.Mock).mockReturnValue({
            index: path.resolve(
                __dirname,
                '../../../../src/app/custom/themes/default/index.ejs',
            ),
            muiTheme: {},
            customTemplateVariables: { siteTitle: '', summary: '' },
            hasIndex: true,
        });
    });

    it('should use the site title in the header, the page title and the public app', async () => {
        const html = await renderPublic('default', {
            customTemplateVariables: { siteTitle: 'My site', summary: 'About' },
        });
        expect(html).toContain('<title>My site</title>');
        expect(html).toContain('window.__SITE_TITLE__ = "My site";');
        expect(html).toMatch(/<h1>\s*My site\s*<\/h1>/);
        expect(html).toMatch(/<p>\s*About\s*<\/p>/);
    });

    it('should keep the default page title and no header without a site title', async () => {
        const html = await renderPublic('default', {});
        expect(html).toContain('<title>Lodex</title>');
        expect(html).not.toContain('__SITE_TITLE__');
        expect(html).not.toContain('site-header');
    });
});
