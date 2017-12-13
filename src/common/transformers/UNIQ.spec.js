import expect from 'expect';

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

    it('should return null if value is not an array nor primitive', () => {
        expect(
            uniqArray({
                a: 'hello',
                b: 'world',
            }),
        ).toEqual(null);
    });
});
