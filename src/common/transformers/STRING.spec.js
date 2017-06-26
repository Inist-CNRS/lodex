import expect from 'expect';

import { toString } from './STRING';

describe('STRING', () => {
    it('should return abcs', () => {
        expect(toString(' hello ')).toBe('hello');
    });

    it('should return uppercase value of each item in array', () => {
        expect(toString([1, true])).toEqual(['1', 'true']);
    });

    it('should return null if value is literal', () => {
        expect(toString({
            a: 'hello',
            b: 'world',
        })).toEqual('');
    });
});
