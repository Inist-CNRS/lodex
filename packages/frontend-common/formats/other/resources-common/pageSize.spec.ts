import { toPageSize } from './pageSize';

describe('toPageSize', () => {
    it.each([
        [1, 1],
        [9, 9],
    ])('keeps %p', (value, expected) => {
        expect(toPageSize(value)).toBe(expected);
    });

    it.each([null, undefined, 0, -3, 1.5, NaN, '4'])(
        'falls back to 6 for %p',
        (value) => {
            expect(toPageSize(value)).toBe(6);
        },
    );
});
