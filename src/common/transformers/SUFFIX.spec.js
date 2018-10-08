import { suffix } from './SUFFIX';

describe('SUFFIX', () => {
    it('should return suffixed value', () => {
        expect(suffix('hello dear', ' world')).toEqual('hello dear world');
    });
});
