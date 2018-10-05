import { prefix } from './PREFIX';

describe('PREFIX', () => {
    it('should return prefixed alue', () => {
        expect(prefix('dear world', 'hello ')).toEqual('hello dear world');
    });
});
