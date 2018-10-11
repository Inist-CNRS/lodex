import { valueToArray } from './ARRAY';

describe('ARRAY', () => {
    it('should return [XXXX]', () => {
        expect(valueToArray('XXXX')).toEqual(['XXXX']);
    });

    it('should return [] if value is empty', () => {
        expect(valueToArray('')).toEqual([]);
    });

    it('should return [1234]', () => {
        expect(valueToArray(1234)).toEqual([1234]);
    });

    it('should return [] if value is null', () => {
        expect(valueToArray(null)).toEqual([]);
    });

    it('should return [] if value is undefined', () => {
        expect(valueToArray(undefined)).toEqual([]);
    });

    it('should return the same array', () => {
        expect(valueToArray([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should return the same array', () => {
        expect(valueToArray([])).toEqual([]);
    });

    it('should return 0 if value is a literal', () => {
        expect(
            valueToArray({
                a: 'hello',
                b: 'world',
            }),
        ).toEqual([
            {
                a: 'hello',
                b: 'world',
            },
        ]);
    });
});
