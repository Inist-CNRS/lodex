import expect from 'expect';

import { trimString } from './TRIM';

describe('TRIM', () => {
    it('should return trim value', () => {
        expect(trimString(' hello  ')).toBe('hello');
    });

    it('should return trim value of each item in array', () => {
        expect(trimString([' hello   ', '\nworld\r\n'])).toEqual([
            'hello',
            'world',
        ]);
    });

    it('should return null if value is literal', () => {
        expect(
            trimString({
                a: ' hello ',
                b: ' world ',
            }),
        ).toEqual(null);
    });
});
