import expect from 'expect';

import { upperCase } from './UPPERCASE';

describe('UPPERCASE', () => {
    it('should return uppercase value', () => {
        expect(upperCase('hello')).toBe('HELLO');
    });

    it('should return uppercase value of each item in array', () => {
        expect(upperCase(['hello', 'world'])).toEqual(['HELLO', 'WORLD']);
    });

    it('should return null if value is literal', () => {
        expect(upperCase({
            a: 'hello',
            b: 'world',
        })).toEqual(null);
    });
});
