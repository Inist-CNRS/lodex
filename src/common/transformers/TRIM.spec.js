import { trimString } from './TRIM';

describe('TRIM', () => {
    it('should return trimed value', () => {
        expect(trimString(' hello  ')).toBe('hello');
    });

    it('should return value if it is not a string', () => {
        expect(trimString(null)).toBe(null);
        expect(trimString(5)).toBe(5);
    });
});
