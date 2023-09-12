import { replace } from './REPLACE_REGEX';

describe('REPLACE_REGEX', () => {
    it('should return new value from string', () => {
        expect(replace('hello world', 'world', 'you')).toBe('hello you');
    });
    it('should return new value from string', () => {
        expect(replace('hello world', 'wo\\w+', 'you')).toBe('hello you');
    });
    it('should return new value from string', () => {
        expect(replace('hello world', '/wo\\w+/', 'you')).toBe('hello you');
    });
    it('should return new value from string', () => {
        expect(replace('hello world', '\\s*wo\\w+', '')).toBe('hello');
    });
    it('should return new value from number search value', () => {
        expect(replace('1', 1, '2')).toBe('2');
    });
});
