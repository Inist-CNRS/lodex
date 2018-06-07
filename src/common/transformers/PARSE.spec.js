import expect from 'expect';

import { parse } from './PARSE';

describe('UPPERCASE', () => {
    it('should return parsered value', () => {
        expect(parse('"hello"')).toBe('hello');
    });
});
