import { uniqArray } from './UNIQ';

describe('UNIQ', () => {
    it('should return uniq value', () => {
        expect(uniqArray(['hello', 'hello'])).toEqual(['hello']);
    });

    it('should return uniq value of each item in array', () => {
        expect(uniqArray(['hello', 'world', 'hello', 'world'])).toEqual([
            'hello',
            'world',
        ]);
    });

    it('should return given value if it is a primitive', () => {
        expect(uniqArray(0)).toEqual(0);
        expect(uniqArray('hello')).toEqual('hello');
    });

    it('should return null if value is not an array nor primitive', () => {
        expect(
            uniqArray({
                a: 'hello',
                b: 'world',
            }),
        ).toEqual(null);
    });
});
