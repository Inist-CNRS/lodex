import { valueToNumber } from './NUMBER';

describe('NUMBER', () => {
    it('should return 1234', () => {
        expect(valueToNumber('1234')).toBe(1234);
    });

    it('should return 1234 if receiving string with number englobed in space', () => {
        expect(valueToNumber('   1234   ')).toBe(1234);
    });

    it('should return 1234', () => {
        expect(valueToNumber(1234)).toBe(1234);
    });

    it('should return 0 if value is null', () => {
        expect(valueToNumber(null)).toBe(0);
    });

    it('should return 0 if value is undefined', () => {
        expect(valueToNumber(undefined)).toBe(0);
    });

    it('should return 0 if value is a string with any non number character', () => {
        expect(valueToNumber('45a')).toBe(0);
    });

    it('should return 0 if value is a string with more than on number separated by space', () => {
        expect(valueToNumber('45 65')).toBe(0);
    });

    it('should return 0 if value is a literal', () => {
        expect(
            valueToNumber({
                a: 'hello',
                b: 'world',
            }),
        ).toEqual(0);
    });
});
