import expect from 'expect';

import { toBoolean } from './BOOLEAN';

describe('BOOLEAN', () => {
    it('should return true', () => {
        expect(toBoolean('true')).toBe(true);
    });

    it('should return booleans for each item in array', () => {
        expect(toBoolean(['1', '0'])).toEqual([true, false]);
    });

    it('should return false if value is any string (except 1, true, on)', () => {
        expect(toBoolean({
            a: 'hello',
            b: 'world',
        })).toEqual(false);
    });
});
