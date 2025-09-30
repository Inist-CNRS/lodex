import composeAsync from './composeAsync';

describe('composeAsync', () => {
    it('should compose given funcs into a single func returning a promise', async () => {
        const fn = composeAsync(
            (arg: any) => arg.join('/'),
            (prev: any) => `previous result is ${prev}`,
        );

        expect(typeof fn).toBe('function');

        expect(await fn([1, 2, 3])).toBe('previous result is 1/2/3');
    });

    it('should work with async func', async () => {
        const fn = composeAsync(
            async (args: any) => args.join('/'),
            async (prev: any) => `previous result is ${prev}`,
        );

        expect(typeof fn).toBe('function');

        expect(await fn([1, 2, 3])).toBe('previous result is 1/2/3');
    });

    it('should work function returning promise', async () => {
        const fn = composeAsync(
            (args: any) => Promise.resolve(args.join('/')),
            (prev: any) => Promise.resolve(`previous result is ${prev}`),
        );

        expect(typeof fn).toBe('function');

        expect(await fn([1, 2, 3])).toBe('previous result is 1/2/3');
    });

    it('should execute function serially', async () => {
        const fn = composeAsync(
            (args: any) => args.toUpperCase(),
            (prev: any) => prev.split(''),
        );

        expect(typeof fn).toBe('function');

        expect(await fn('hello')).toEqual(['H', 'E', 'L', 'L', 'O']);
    });
});
