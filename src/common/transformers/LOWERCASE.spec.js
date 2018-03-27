import expect from 'expect';

import { valueToLowerCase } from './LOWERCASE';

describe('LOWERCASE', () => {
    it('should return lowercase value', () => {
        expect(valueToLowerCase('HELLO')).toBe('hello');
    });
});
