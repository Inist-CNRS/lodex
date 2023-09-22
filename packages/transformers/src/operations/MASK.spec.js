import { mask } from './MASK';

describe('MASK', () => {
    it('should return mask value', () => {
        expect(mask('hello', '^\\w+$')).toBe('hello');
    });
    it('should return mask value', () => {
        expect(mask('hello!', '^\\w+$')).toBeNull();
    });
    it('should return null if null', () => {
        expect(mask(null, '^\\w+$')).toBeNull();
    });
    it('should return null if empty', () => {
        expect(mask('', '^\\w+$')).toBeNull();
    });
    it('should return null if object', () => {
        expect(mask({}, '^\\w+$')).toBeNull();
    });
    it('should return null if number', () => {
        expect(mask(1111, '^\\w+$')).toBeNull();
    });
});
