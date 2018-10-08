import { select } from './SELECT';

describe('SELECT', () => {
    it('should return splitted value', () => {
        expect(select({ a: { aa: 1 }, b: 2 }, 'a.aa')).toEqual(1);
    });
});
