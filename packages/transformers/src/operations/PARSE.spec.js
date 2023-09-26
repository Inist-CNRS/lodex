import { parse } from './PARSE';

describe('PARSE', () => {
    it('should return parsered value', () => {
        expect(parse('"hello"')).toBe('hello');
    });

    it('should return orginal value', () => {
        expect(parse(true)).toBe(true);
    });

});
