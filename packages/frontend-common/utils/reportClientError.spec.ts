import {
    describeError,
    installClientErrorReporter,
    reportClientError,
} from './reportClientError';

describe('reportClientError', () => {
    const fetchMock = jest.fn(() => Promise.resolve());
    const sentBody = (call = 0) =>
        JSON.parse(
            (
                fetchMock.mock.calls[call] as unknown as [
                    string,
                    { body: string },
                ]
            )[1].body,
        );

    beforeEach(() => {
        fetchMock.mockClear();
        // @ts-expect-error fetch is not defined in jsdom
        global.fetch = fetchMock;
        sessionStorage.setItem('lodex-tenant', 'my-tenant');
    });

    it('sends the error to the api with the tenant header', () => {
        reportClientError('window.onerror', new Error('boom'));

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, options] = fetchMock.mock.calls[0] as unknown as [
            string,
            { headers: Record<string, string>; body: string },
        ];
        expect(url).toBe('/api/client-errors');
        expect(options.headers['X-Lodex-Tenant']).toBe('my-tenant');
        expect(sentBody()).toMatchObject({
            source: 'window.onerror',
            message: 'boom',
        });
    });

    it('sends the same error only once', () => {
        const error = new Error('twice');
        reportClientError('window.onerror', error);
        reportClientError('window.onerror', error);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('ignores errors coming from browser extensions', () => {
        const error = new Error('extension');
        error.stack = 'at foo (chrome-extension://abc/content.js:1:1)';
        reportClientError('window.onerror', error);
        reportClientError('window.onerror', 'Script error.');
        expect(fetchMock).not.toHaveBeenCalled();
    });

    describe('describeError', () => {
        it('uses the error name when the message is empty', () => {
            expect(describeError(new TypeError('')).message).toBe('TypeError');
        });

        it('describes rejections that are not errors', () => {
            expect(describeError({ message: 'Unauthorized' }).message).toBe(
                'Unauthorized',
            );
            expect(describeError({ status: 401 }).message).toBe(
                '{"status":401}',
            );
            expect(describeError(undefined).message).toBe('undefined');

            const circular: Record<string, unknown> = {};
            circular.self = circular;
            expect(describeError(circular).message).toBe('[object Object]');
        });
    });

    describe('installClientErrorReporter', () => {
        beforeAll(() => installClientErrorReporter());

        it('reports uncaught errors', () => {
            window.dispatchEvent(
                new ErrorEvent('error', { error: new Error('uncaught') }),
            );
            expect(sentBody()).toMatchObject({
                source: 'window.onerror',
                message: 'uncaught',
            });
        });

        it('reports unhandled promise rejections', () => {
            const event = Object.assign(new Event('unhandledrejection'), {
                reason: new Error('rejected'),
            });
            window.dispatchEvent(event);
            expect(sentBody()).toMatchObject({
                source: 'unhandledrejection',
                message: 'rejected',
            });
        });
    });
});
