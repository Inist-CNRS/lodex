import expect from 'expect';

import { split } from './SPLIT';

describe('SPLIT', () => {
    it('should return splitted value', () => {
        expect(split('hello dear world', ' dear ')).toEqual(['hello', 'world']);
    });

    it('should return empty string if value is null', () => {
        expect(split(undefined, ' dear ')).toEqual('');
    });

    it('should throw an error if value is not a string', () => {
        expect(() => split([], ' ')).toThrow('Invalid value: need a string');
    });
});
