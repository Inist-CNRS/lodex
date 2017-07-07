import expect from 'expect';

import { toString } from './STRING';

describe('STRING', () => {
    it('should return "hello"', () => {
        expect(toString(' hello ')).toBe('hello');
    });

    it('should return a string value for each item in array', () => {
        expect(toString([1, true])).toEqual(['1', 'true']);
    });

    it('should return an empty string when value is an object', () => {
        expect(toString({
            a: 'hello',
            b: 'world',
        })).toEqual('');
    });
});
