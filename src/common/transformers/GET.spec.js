import expect from 'expect';

import { get } from './GET';

describe('GET', () => {
    it("should return key's value from object", () => {
        expect(get({ a: { aa: 1 }, b: 2 }, 'a.aa')).toEqual(1);
    });
});
