import expect from 'expect';

import { toBoolean } from './BOOLEAN';

describe('BOOLEAN', () => {
    it('should return true', () => {
        expect(toBoolean('true')).toBe(true);
    });

    it('should return uppercase value of each item in array', () => {
        expect(toBoolean(['1', '0'])).toEqual([true, false]);
    });

    it('should return null if value is literal', () => {
        expect(toBoolean({
            a: 'hello',
            b: 'world',
        })).toEqual(false);
    });
});
