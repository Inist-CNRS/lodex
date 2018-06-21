import expect from 'expect';

import { split } from './SPLIT';

describe.only('SPLIT', () => {
    it('should return splitted value', () => {
        expect(split('hello dear world', ' dear ')).toEqual(['hello', 'world']);
    });

    it('should return empty array if value is null', () => {
        const result = split(undefined, ' dear ');
        expect(result).toBeA(Array);
        expect(result).toEqual([]);
    });

    it('should throw an error if value is not a string', () => {
        expect(() => split([], ' ')).toThrow('Invalid value: need a string');
    });

    it('should return without extra with space', () => {
        expect(split('hello ; ; world', ';')).toEqual(['hello', 'world']);
    });
});
