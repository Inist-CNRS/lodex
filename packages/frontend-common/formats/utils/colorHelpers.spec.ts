import { addTransparency, opacityToHex, rgbToHex, toHex } from './colorHelpers';

describe('colorHelpers', () => {
    describe('rgbToHex', () => {
        it('should convert rgb to hex', () => {
            const hex = rgbToHex({
                r: 255,
                g: 0,
                b: 0,
            });
            expect(hex).toBe('#ff0000');
        });

        it('should convert rgb to hex with leading zeros', () => {
            const hex = rgbToHex({
                r: 0,
                g: 15,
                b: 255,
            });
            expect(hex).toBe('#000fff');
        });
    });
    describe('toHex', () => {
        it.each([
            [0, '00'],
            [15, '0f'],
            [16, '10'],
            [42, '2a'],
            [64, '40'],
            [66, '42'],
            [128, '80'],
            [192, 'c0'],
            [240, 'f0'],
            [255, 'ff'],
        ] as const)('should convert number %d to hex %s', (number, hex) => {
            expect(toHex(number)).toBe(hex);
        });
    });

    describe('opacityToHex', () => {
        it.each([
            [0, '00'],
            [0.1, '1a'],
            [0.2, '33'],
            [0.3, '4d'],
            [0.4, '66'],
            [0.5, '80'],
            [0.6, '99'],
            [0.7, 'b3'],
            [0.8, 'cc'],
            [0.9, 'e6'],
            [1, 'ff'],
        ] as const)('should convert opacity %d to hex %s', (opacity, hex) => {
            expect(opacityToHex(opacity)).toBe(hex);
        });
    });

    describe('addTransparency', () => {
        it('should add transparency to hex color', () => {
            const hexWithTransparency = addTransparency('#ff0000', 0.5);
            expect(hexWithTransparency).toBe('#ff000080');
        });
    });
});
