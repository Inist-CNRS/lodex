import expect from 'expect';

import { toNumber } from './NUMBER';

describe('NUMBER', () => {
    it('should return 1234', () => {
        expect(toNumber('1234')).toBe(1234);
    });

    it('should return integer values for each item in array', () => {
        expect(toNumber([' 1234 ', '1', true, '', 'dddf'])).toEqual([
            1234,
            1,
            1,
            0,
            0,
        ]);
    });

    it('should return zero if value is any non-number string', () => {
        expect(
            toNumber({
                a: 'hello',
                b: 'world',
            }),
        ).toEqual(0);
    });
});
