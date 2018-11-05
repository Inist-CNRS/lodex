import { mask } from './MASK';

describe.only('MASK', () => {
    it('should return mask value', () => {
        expect(mask('hello', '^\\w+$')).toBe('hello');
    });
    it('should return mask value', () => {
        expect(mask('hello!', '^\\w+$')).toBe(null);
    });
});
