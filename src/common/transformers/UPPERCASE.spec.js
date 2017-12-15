import expect from 'expect';

import { valueToUpperCase } from './UPPERCASE';

describe('UPPERCASE', () => {
    it('should return uppercase value', () => {
        expect(valueToUpperCase('hello')).toBe('HELLO');
    });

    it('should work with number', () => {
        expect(valueToUpperCase(5)).toBe('5');
    });

    it('should return `` if value is literal', () => {
        expect(
            valueToUpperCase({
                a: 'hello',
                b: 'world',
            }),
        ).toEqual(null);
    });
});
