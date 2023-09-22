import { truncate } from './TRUNCATE';

describe('TRUNCATE', () => {
    it('#1', () => {
        expect(truncate('hello world', 5)).toEqual('hello');
    });

    it('#2', () => {
        expect(truncate([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3]);
    });
});
