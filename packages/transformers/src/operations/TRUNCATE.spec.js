import { truncate } from './TRUNCATE';

describe('TRUNCATE', () => {
    it('should keep the first x element of a string', () => {
        expect(truncate('hello world', 5)).toEqual('hello');
    });
    it('should keep the first x digit of a number', () => {
        expect(truncate(65535, 3)).toEqual('655');
    });
    it('should keep the first x character of a boolean', () => {
        expect(truncate(true, 1)).toEqual('t');
    });
    it('should keep the first x character of a date', () => {
        expect(truncate(new Date('2025-01-01'), 3)).toEqual('Wed');
    });

    it('should keep the first x element of an array', () => {
        expect(truncate([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3]);
    });
});
