import expect from 'expect';

import { capitalizeString } from './CAPITALIZE';

describe('CAPITALIZE', () => {
    it('should return capitalize value', () => {
        expect(capitalizeString('hello')).toBe('Hello');
    });

    it('should return value if it is not a string', () => {
        expect(capitalizeString(null)).toEqual(null);
        expect(capitalizeString(5)).toEqual(5);
    });
});
