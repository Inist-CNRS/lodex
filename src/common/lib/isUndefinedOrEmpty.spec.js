import isUndefinedOrEmpty from './isUndefinedOrEmpty';

describe('isEmpty', () => {
    it('should return "true" if the value is "undefined" or an "empty string"', () => {
        expect(isUndefinedOrEmpty(undefined)).toBe(true);
        expect(isUndefinedOrEmpty('')).toBe(true);
    });

    it('should return "false" otherwise', () => {
        expect(isUndefinedOrEmpty(null)).toBe(false);
        expect(isUndefinedOrEmpty([])).toBe(false);
        expect(isUndefinedOrEmpty('matthieu')).toBe(false);
        expect(isUndefinedOrEmpty(18)).toBe(false);
        expect(isUndefinedOrEmpty({})).toBe(false);
        expect(isUndefinedOrEmpty([1, 2, 3])).toBe(false);
    });
});
