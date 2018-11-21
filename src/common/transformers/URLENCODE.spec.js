import { valueToURLEncode } from './URLENCODE';

describe('URLENCODE', () => {
    it('should return urlencode for string', () => {
        expect(valueToURLEncode('10.1007/978-0-387-89561-1?')).toBe(
            '10.1007%2F978-0-387-89561-1%3F',
        );
    });
    it('should return empty for empty', () => {
        expect(valueToURLEncode(null)).toBe(null);
        expect(valueToURLEncode('')).toBe('');
    });
    it('should return empty for non string', () => {
        expect(valueToURLEncode(12345)).toBe(null);
        expect(valueToURLEncode(false)).toBe(null);
        expect(valueToURLEncode({})).toBe(null);
        expect(valueToURLEncode([])).toBe(null);
    });
});
