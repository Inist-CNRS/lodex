import { reloadOnceOnError } from './lazyComponent';

describe('reloadOnceOnError', () => {
    const reload = jest.fn();
    const originalLocation = window.location;

    beforeEach(() => {
        sessionStorage.clear();
        reload.mockClear();
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...originalLocation, reload },
        });
    });

    afterAll(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalLocation,
        });
    });

    it('reloads the page once when a chunk fails to load, then rethrows', async () => {
        const error = new Error('Failed to fetch dynamically imported module');
        const load = reloadOnceOnError(() => Promise.reject(error));

        // first failure: reload and never settle
        load();
        await Promise.resolve();
        await Promise.resolve();
        expect(reload).toHaveBeenCalledTimes(1);

        // still failing after the reload: let the error boundary handle it
        await expect(load()).rejects.toBe(error);
        expect(reload).toHaveBeenCalledTimes(1);
    });

    it('resets the flag once a chunk loads', async () => {
        sessionStorage.setItem('lodex-chunk-reload', '1');
        const load = reloadOnceOnError(() => Promise.resolve('module'));

        await expect(load()).resolves.toBe('module');
        expect(sessionStorage.getItem('lodex-chunk-reload')).toBeNull();
    });
});
