import { shift } from './SHIFT';

describe('SHIFT', () => {
    it('#1', () => {
        expect(shift('The world', 4)).toEqual('world');
    });

    it('#2', () => {
        expect(shift([1, 2, 3, 4, 5], 2)).toEqual([3, 4, 5]);
    });
});
