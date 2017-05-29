import expect from 'expect';

import { suffix } from './SUFFIX';

describe('SUFFIX', () => {
    it('should return splitted value', () => {
        expect(suffix('hello dear', ' world')).toEqual('hello dear world');
    });

    it('should return empty array if value is null', () => {
        const result = suffix(undefined, 'hello');
        expect(result).toBeA(String);
        expect(result).toEqual('hello');
    });

    it('should return array contains the value', () => {
        const result = suffix(['hello', 'dear'], 'world');
        expect(result).toBeA(Array);
        expect(result[0]).toEqual('hello');
        expect(result[1]).toEqual('dear');
        expect(result[2]).toEqual('world');
    });
});
