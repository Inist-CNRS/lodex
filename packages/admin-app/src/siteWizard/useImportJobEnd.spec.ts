import { act, renderHook } from '@testing-library/react';
import { io } from 'socket.io-client';
import { useImportJobEnd } from './useImportJobEnd';

jest.mock('socket.io-client', () => ({ io: jest.fn() }));

// the hook is unmounted after each test, which fails a pending wait
const startWaiting = (result: {
    current: ReturnType<typeof useImportJobEnd>;
}) => {
    const wait = result.current.waitForImportEnd();
    wait.ended.catch(() => {});
    return wait;
};

describe('useImportJobEnd', () => {
    let handlers: Record<string, (data: any) => void>;
    let socket: { on: jest.Mock; once: jest.Mock; disconnect: jest.Mock };

    const emit = (data: any) =>
        act(() => {
            handlers['lodex_default-import'](data);
        });

    beforeEach(() => {
        handlers = {};
        socket = {
            on: jest.fn((event, handler) => {
                handlers[event] = handler;
            }),
            once: jest.fn((event, handler) => {
                handlers[event] = handler;
            }),
            disconnect: jest.fn(),
        };
        (io as jest.Mock).mockReturnValue(socket);
        sessionStorage.setItem('lodex-dbName', 'lodex');
        sessionStorage.setItem('lodex-tenant', 'default');
    });

    afterEach(() => sessionStorage.clear());

    it('does not connect before waiting for an import end', () => {
        renderHook(() => useImportJobEnd());
        expect(io).not.toHaveBeenCalled();
    });

    it('listens on the import channel while waiting', () => {
        const { result } = renderHook(() => useImportJobEnd());
        startWaiting(result);
        expect(socket.on).toHaveBeenCalledWith(
            'lodex_default-import',
            expect.any(Function),
        );
    });

    it('is connected once the socket connects', async () => {
        const { result } = renderHook(() => useImportJobEnd());
        let isConnected = false;
        const { connected } = startWaiting(result);
        const promise = connected.then(() => {
            isConnected = true;
        });
        await Promise.resolve();
        expect(isConnected).toBe(false);
        handlers.connect(undefined);
        await promise;
        expect(isConnected).toBe(true);
    });

    it('fails to connect on a connection error', async () => {
        const { result } = renderHook(() => useImportJobEnd());
        const { connected } = startWaiting(result);
        handlers.connect_error(new Error('xhr poll error'));
        await expect(connected).rejects.toThrow('xhr poll error');
    });

    it('resolves only after the import ends successfully, then disconnects', async () => {
        const { result } = renderHook(() => useImportJobEnd());
        let done = false;
        const promise = startWaiting(result).ended.then(() => {
            done = true;
        });
        emit({ isImporting: true, success: false });
        await Promise.resolve();
        expect(done).toBe(false);
        expect(socket.disconnect).not.toHaveBeenCalled();
        emit({ isImporting: false, success: true });
        await promise;
        expect(done).toBe(true);
        expect(socket.disconnect).toHaveBeenCalled();
    });

    it('rejects with the message on failure or cancel', async () => {
        const { result } = renderHook(() => useImportJobEnd());
        const promise = startWaiting(result).ended;
        emit({
            isImporting: false,
            success: false,
            message: 'cancelled_import',
        });
        await expect(promise).rejects.toThrow('cancelled_import');
    });

    it('rejects with import_failed when no message', async () => {
        const { result } = renderHook(() => useImportJobEnd());
        const promise = startWaiting(result).ended;
        emit({ isImporting: false, success: false });
        await expect(promise).rejects.toThrow('import_failed');
    });

    it('disconnects when the wait is stopped', () => {
        const { result } = renderHook(() => useImportJobEnd());
        startWaiting(result);
        result.current.stopWaitingForImportEnd();
        expect(socket.disconnect).toHaveBeenCalled();
    });

    it('fails the pending wait when stopped with an error', async () => {
        const { result } = renderHook(() => useImportJobEnd());
        const { ended } = startWaiting(result);
        result.current.stopWaitingForImportEnd(new Error('cancelled_import'));
        await expect(ended).rejects.toThrow('cancelled_import');
        expect(socket.disconnect).toHaveBeenCalled();
    });

    describe('giveUpWaitingForImportEnd', () => {
        beforeEach(() => jest.useFakeTimers());
        afterEach(() => jest.useRealTimers());

        it('fails the wait after the delay when no end came', async () => {
            const { result } = renderHook(() => useImportJobEnd());
            const { ended } = startWaiting(result);
            result.current.giveUpWaitingForImportEnd(
                1000,
                new Error('cancelled_import'),
            );
            jest.advanceTimersByTime(1000);
            await expect(ended).rejects.toThrow('cancelled_import');
        });

        it('keeps the end received before the delay', async () => {
            const { result } = renderHook(() => useImportJobEnd());
            const { ended } = startWaiting(result);
            result.current.giveUpWaitingForImportEnd(
                1000,
                new Error('cancelled_import'),
            );
            emit({ isImporting: false, success: true });
            jest.advanceTimersByTime(1000);
            await expect(ended).resolves.toBeUndefined();
        });

        it('does not fail a newer wait', async () => {
            const { result } = renderHook(() => useImportJobEnd());
            startWaiting(result);
            result.current.giveUpWaitingForImportEnd(
                1000,
                new Error('cancelled_import'),
            );
            const { ended } = startWaiting(result);
            let settled = false;
            ended.then(
                () => (settled = true),
                () => (settled = true),
            );
            jest.advanceTimersByTime(1000);
            await Promise.resolve();
            expect(settled).toBe(false);
        });
    });

    it('fails a pending wait on unmount', async () => {
        const { result, unmount } = renderHook(() => useImportJobEnd());
        const { ended } = startWaiting(result);
        unmount();
        await expect(ended).rejects.toThrow('site_wizard_import_interrupted');
    });

    it('disconnects on unmount while waiting', () => {
        const { result, unmount } = renderHook(() => useImportJobEnd());
        startWaiting(result);
        unmount();
        expect(socket.disconnect).toHaveBeenCalled();
    });
});
