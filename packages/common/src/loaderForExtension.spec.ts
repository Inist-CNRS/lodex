import { getExtension, getLoaderForExtension } from './loaderForExtension';

describe('getExtension', () => {
    it('returns the extension of a file name, in lower case', () => {
        expect(getExtension('data.CSV')).toBe('csv');
        expect(getExtension('my.data.jsonl')).toBe('jsonl');
    });

    it('keeps tar.gz whole', () => {
        expect(getExtension('istex.tar.gz')).toBe('tar.gz');
        expect(getExtension('data.csv.gz')).toBe('gz');
    });

    it('reads the path of a URL, without its query string', () => {
        expect(
            getExtension(
                'https://zenodo.org/records/1/files/data.csv?download=1',
            ),
        ).toBe('csv');
        expect(getExtension('https://example.org/data.tsv#top')).toBe('tsv');
    });

    it('returns an empty extension without one', () => {
        expect(getExtension('README')).toBe('');
        expect(getExtension('https://api.openalex.org/works?filter=x')).toBe(
            '',
        );
        expect(getExtension('https://example.org')).toBe('');
        expect(getExtension(undefined)).toBe('');
    });
});

describe('getLoaderForExtension', () => {
    it('returns the extension when a loader has its name', () => {
        expect(getLoaderForExtension('csv')).toBe('csv');
    });

    it('returns the loader of a format named otherwise', () => {
        expect(getLoaderForExtension('jsonl')).toBe('json-lines');
        expect(getLoaderForExtension('ndjson')).toBe('json-lines');
        expect(getLoaderForExtension('tar.gz')).toBe('tar-gz');
        expect(getLoaderForExtension('tgz')).toBe('tar-gz');
    });

    it('ignores the case', () => {
        expect(getLoaderForExtension('JSONL')).toBe('json-lines');
        expect(getLoaderForExtension('CSV')).toBe('csv');
    });

    it('returns an empty name without extension', () => {
        expect(getLoaderForExtension(undefined)).toBe('');
    });
});
