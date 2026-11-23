import { join } from './JOIN';

describe('JOIN', () => {
    it('should return joined value', () => {
        expect(join(['hello', 'world'], ' dear ')).toBe('hello dear world');
    });

    it('should return empty string if value is null', () => {
        expect(join(null, ' dear ')).toEqual('');
    });
    it('should return the same if value is a string', () => {
        expect(join('hello', ' dear ')).toEqual('hello');
    });

    it('should throw an error if value is not an array', () => {
        expect(() => join({ text: 'hello' }, ' ')).toThrow(
            'Invalid value: need an array'
        );
    });
});
