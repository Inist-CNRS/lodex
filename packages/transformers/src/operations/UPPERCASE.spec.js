import { valueToUpperCase } from './UPPERCASE';

describe('UPPERCASE', () => {
    it('should return uppercase value', () => {
        expect(valueToUpperCase('hello')).toBe('HELLO');
    });
});
