import { defval } from './DEFAULT';

describe('DEFAULT', () => {
    it('should return default value if null', () => {
        expect(defval(null, 'Yo')).toBe('Yo');
    });

    it('should return default value if undefined', () => {
        expect(defval(null, 'Yo')).toBe('Yo');
    });

    it('should return default value if empty', () => {
        expect(defval('', 'Yo')).toBe('Yo');
    });

    it('should return 0 if 0', () => {
        expect(defval(0, 'Yo')).toBe(0);
    });

    it('should return false if false', () => {
        expect(defval(false, 'Yo')).toBe(false);
    });

    it('should return filled array if empty array', () => {
        expect(defval([], 'Yo')).toEqual(['Yo']);
    });

    it('should return value', () => {
        expect(defval('Ya', 'Yo')).toEqual('Ya');
    });

    it('should return value if empty object', () => {
        expect(defval({}, 'Yo')).toEqual({});
    });

    it('should return value if object', () => {
        expect(defval({ a: 'Ya' }, 'Yo')).toEqual({ a: 'Ya' });
    });

});
