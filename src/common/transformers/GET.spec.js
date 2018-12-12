import { get } from './GET';

describe('GET', () => {
    it("should return key's value from object (number)", () => {
        expect(get({ a: { aa: 1 }, b: 2 }, 'a.aa')).toEqual(1);
    });

    it("should return key's value from object (string)", () => {
        expect(get({ a: { aa: '1' }, b: 2 }, 'a.aa')).toEqual('1');
    });

    it("should return all key's values from object", () => {
        expect(get({ a: { aa: 1, bb: 1 }, b: 2 }, 'a.aa;a.bb')).toEqual([1, 1]);
    });

    it('should return nothing with empty path', () => {
        expect(get({ a: { aa: 1, bb: 1 }, b: 2 }, '')).toEqual('');
    });

    it("should return all mixed key's values (ordered)", () => {
        expect(get({ a: { aa: 1, bb: [2, 3] }, b: 4 }, 'a.aa;a.bb')).toEqual([
            1,
            2,
            3,
        ]);
    });

    it("should return all mixed key's values (unordered)", () => {
        expect(get({ a: { aa: 1, bb: [2, 3] }, b: 4 }, 'a.bb;a.aa')).toEqual([
            2,
            3,
            1,
        ]);
    });

    it('should return nothing with empty paths', () => {
        expect(get({ a: { aa: 1, bb: 1 }, b: 2 }, ';')).toEqual(['', '']);
    });
});
