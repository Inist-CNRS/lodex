import { format } from './FORMAT';

describe('FORMAT', () => {
    it('should return formated value', () => {
        expect(format('hello', '<%s>')).toEqual('<hello>');
    });
    it('should return formated value', () => {
        expect(format(['hello', 'world'], '%s/%s')).toEqual('hello/world');
    });
});
