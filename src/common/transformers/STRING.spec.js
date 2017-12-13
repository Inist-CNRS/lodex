import expect from 'expect';

import { valueToString } from './STRING';

describe('STRING', () => {
    it('should return "hello"', () => {
        expect(valueToString(' hello ')).toBe('hello');
    });

    it('should return `0` if receiving 0', () => {
        expect(valueToString(0)).toBe('0');
    });

    it('should return `` if receiving null', () => {
        expect(valueToString(null)).toBe('');
    });

    it('should return `` if receiving undefined', () => {
        expect(valueToString(undefined)).toBe('');
    });

    it('should return an empty string when value is an object', () => {
        expect(
            valueToString({
                a: 'hello',
                b: 'world',
            }),
        ).toEqual('');
        expect(valueToString(new Date())).toEqual('');
    });
});
