import expect from 'expect';
import composeAsync from './composeAsync';

describe('composeAsync', () => {
    it('should compose given funcs into a single func returning a promise', async () => {
        const fn = composeAsync(
            arg => arg.join('/'),
            prev => `previous result is ${prev}`,
        );

        expect(fn).toBeA('function');

        expect(await fn([1, 2, 3])).toBe('previous result is 1/2/3');
    });

    it('should work with async func', async () => {
        const fn = composeAsync(
            async args => args.join('/'),
            async prev => `previous result is ${prev}`,
        );

        expect(fn).toBeA('function');

        expect(await fn([1, 2, 3])).toBe('previous result is 1/2/3');
    });

    it('should work function returning promise', async () => {
        const fn = composeAsync(
            args => Promise.resolve(args.join('/')),
            prev => Promise.resolve(`previous result is ${prev}`),
        );

        expect(fn).toBeA('function');

        expect(await fn([1, 2, 3])).toBe('previous result is 1/2/3');
    });

    it('should execute function serially', async () => {
        const fn = composeAsync(
            args => args.toUpperCase(),
            prev => prev.split(''),
        );

        expect(fn).toBeA('function');

        expect(await fn('hello')).toEqual(['H', 'E', 'L', 'L', 'O']);
    });
});
