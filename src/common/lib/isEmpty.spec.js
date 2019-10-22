import isEmpty from './isEmpty';

describe('isEmpty', () => {
    it('should return "true" if the value is "null", "undefined", an "empty string" or an "empty array"', () => {
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty('')).toBe(true);
        expect(isEmpty([])).toBe(true);
    });

    it('should return "false" otherwise', () => {
        expect(isEmpty('matthieu')).toBe(false);
        expect(isEmpty(18)).toBe(false);
        expect(isEmpty({})).toBe(false);
        expect(isEmpty([1, 2, 3])).toBe(false);
    });
});
