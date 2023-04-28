import getUri from '../src/JSONLDObject/getUri';

describe('JSONLDObject / getUri', () => {
    it('should throw when no parameters given', () => {
        try {
            const output = getUri();
            expect(output).toBeFalsy();
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });

    it('should add hostname at the beginning of any parameter except strings starting with "http"', () => {
        expect(getUri('a')).toBe('http://data.istex.fr/a');
    });

    it('should normalize relative path', () => {
        expect(getUri('a/../b')).toBe('http://data.istex.fr/b');
    });

    it('should return the URI when it begins with http:// or https://', () => {
        expect(getUri('http://a')).toBe('http://a');
        expect(getUri('https://a')).toBe('https://a');
    });

    it('should remove the instance numbers', () => {
        expect(getUri('http://a-b-5.data.istex.fr')).toBe(
            'http://a-b.data.istex.fr',
        );
    });

    it('should add given hostname at the beginning of any parameter except strings starting with "http"', () => {
        expect(getUri('a', 'https://data.istex.fr'))
            .toBe('https://data.istex.fr/a');
    });
});
