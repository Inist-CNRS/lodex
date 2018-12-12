import { get } from './GET';

describe('GET', () => {
    it("should return key's value from object (number)", () => {
        expect(get({ a: { aa: 1 }, b: 2 }, 'a.aa')).toEqual(1);
    });

    it("should return key's value from object (string)", () => {
        expect(get({ a: { aa: '1' }, b: 2 }, 'a.aa')).toEqual('1');
    });

    it("should return all key's value from object", () => {
        expect(get({ a: { aa: 1, bb: 1 }, b: 2 }, 'a.aa;a.bb')).toEqual([1, 1]);
    });

    it('should return nothing with empty path', () => {
        expect(get({ a: { aa: 1, bb: 1 }, b: 2 }, '')).toEqual('');
    });

    it('should return nothing with empty paths', () => {
        expect(get({ a: { aa: 1, bb: 1 }, b: 2 }, ';')).toEqual(['', '']);
    });

});
