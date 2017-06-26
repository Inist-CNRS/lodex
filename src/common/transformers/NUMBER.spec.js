import expect from 'expect';

import { toNumber } from './NUMBER';

describe('NUMBER', () => {
    it('should return 123', () => {
        expect(toNumber('1234')).toBe(1234);
    });

    it('should return uppercase value of each item in array', () => {
        expect(toNumber([' 1234 ', '1', true, '', 'dddf'])).toEqual([1234, 1, 1, 0, 0]);
    });

    it('should return null if value is literal', () => {
        expect(toNumber({
            a: 'hello',
            b: 'world',
        })).toEqual(0);
    });
});
