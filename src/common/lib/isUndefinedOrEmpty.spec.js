import isUndefinedOrEmpty from './isUndefinedOrEmpty';

describe('isUndefinedOrEmpty', () => {
    it(`should return "true" if the value is "undefined"`, () => {
        expect(isUndefinedOrEmpty(undefined)).toBe(true);
    });

    it(`should return "true" if the value is "''"`, () => {
        expect(isUndefinedOrEmpty('')).toBe(true);
    });

    it(`should return "false" if value is "null"`, () => {
        expect(isUndefinedOrEmpty(null)).toBe(false);
    });

    it(`should return "false" if value is "[]"`, () => {
        expect(isUndefinedOrEmpty([])).toBe(false);
    });

    it(`should return "false" if value is "[1, 2, 3]"`, () => {
        expect(isUndefinedOrEmpty([1, 2, 3])).toBe(false);
    });

    it(`should return "false" if value is "matthieu"`, () => {
        expect(isUndefinedOrEmpty('matthieu')).toBe(false);
    });

    it(`should return "false" if value is "18"`, () => {
        expect(isUndefinedOrEmpty(18)).toBe(false);
    });
});
