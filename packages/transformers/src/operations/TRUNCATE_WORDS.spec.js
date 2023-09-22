import { truncateWords } from './TRUNCATE_WORDS';

describe('TRUNCATE_WORDS', () => {
    it('should return prefixed alue', () => {
        expect(truncateWords('hello world', 1)).toEqual('hello');
    });
});
