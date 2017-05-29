import expect from 'expect';

import { prefix } from './PREFIX';

describe('PREFIX', () => {
    it('should return splitted value', () => {
        expect(prefix('dear world', 'hello ')).toEqual('hello dear world');
    });

    it('should return empty array if value is null', () => {
        const result = prefix(undefined, 'hello');
        expect(result).toEqual('hello');
    });

    it('should return array contains the value', () => {
        const result = prefix(['dear', 'world'], 'hello');
        expect(result).toBeA(Array);
        expect(result[0]).toEqual('hello');
        expect(result[1]).toEqual('dear');
        expect(result[2]).toEqual('world');
    });
});
