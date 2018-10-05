import { remove } from './REMOVE';

describe('REMOVE', () => {
    it('should return new value from string', () => {
        expect(remove('hello world', ' world')).toBe('hello');
    });
    it('should return new value from array', () => {
        expect(remove(['hello', 'world'], 'world').length).toEqual(1);
    });
});
