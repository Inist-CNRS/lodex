import { parse } from './PARSE';

describe('PARSE', () => {
    it('should return parsered value', () => {
        expect(parse('"hello"')).toBe('hello');
    });
});
