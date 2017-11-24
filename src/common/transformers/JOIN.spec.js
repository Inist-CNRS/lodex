import expect from 'expect';

import { join } from './JOIN';

describe('JOIN', () => {
    it('should return joined value', () => {
        expect(join(['hello', 'world'], ' dear ')).toBe('hello dear world');
    });

    it('should return empty string if value is null', () => {
        expect(join(null, ' dear ')).toEqual('');
    });

    it('should throw an error if value is not an array', () => {
        expect(() => join('hello', ' ')).toThrow(
            'Invalid value: need an array',
        );
    });
});
