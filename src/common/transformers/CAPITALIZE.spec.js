import expect from 'expect';

import { capitalizeString } from './CAPITALIZE';

describe('CAPITALIZE', () => {
    it('should return capitalize value', () => {
        expect(capitalizeString('hello')).toBe('Hello');
    });

    it('should return capitalize value of each item in array', () => {
        expect(capitalizeString(['HELLO', 'world'])).toEqual([
            'Hello',
            'World',
        ]);
    });

    it('should return null if value is literal', () => {
        expect(
            capitalizeString({
                a: 'hello',
                b: 'world',
            }),
        ).toEqual(null);
    });
});
