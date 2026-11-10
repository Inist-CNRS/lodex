import { loadDatasetFile, loadFile } from './loadFile';
// @ts-expect-error TS2306
import Resumable from '@recuperateur/resumablejs';

const mockResumable = {
    handlers: {} as Record<string, (...args: unknown[]) => void>,
    upload: jest.fn(),
    cancel: jest.fn(),
    progress: jest.fn(() => 0),
};

jest.mock('@recuperateur/resumablejs', () =>
    jest.fn().mockImplementation(() => ({
        on: (event: string, handler: (...args: unknown[]) => void) => {
            mockResumable.handlers[event] = handler;
        },
        addFile: (file: File) =>
            mockResumable.handlers.fileAdded?.({
                file,
                uniqueIdentifier: 'upload-id',
            }),
        upload: mockResumable.upload,
        cancel: mockResumable.cancel,
        progress: mockResumable.progress,
    })),
);

const file = new File(['a'], 'a.csv');

describe('loadFile', () => {
    beforeEach(() => {
        mockResumable.handlers = {};
        jest.clearAllMocks();
    });

    it('resolves with the server message once the file is uploaded', async () => {
        const promise = loadFile('/api/upload/csv', file, 'token');
        expect(mockResumable.upload).toHaveBeenCalled();
        mockResumable.handlers.fileSuccess(file, 'done');
        await expect(promise).resolves.toBe('done');
    });

    it('reports the uploaded fraction', () => {
        const onProgress = jest.fn();
        loadFile('/api/upload/csv', file, 'token', null, { onProgress });
        mockResumable.progress.mockReturnValue(0.42);
        mockResumable.handlers.progress();
        expect(onProgress).toHaveBeenCalledWith(0.42);
    });

    it('cancels the upload when aborted', async () => {
        const controller = new AbortController();
        const promise = loadFile('/api/upload/csv', file, 'token', null, {
            signal: controller.signal,
        });
        controller.abort();
        await expect(promise).rejects.toThrow('upload_cancelled');
        expect(mockResumable.cancel).toHaveBeenCalled();
    });

    it('tells the server about a cancelled dataset upload', async () => {
        const fetchMock = jest.fn(async () => ({
            json: async () => ({ status: 'cancelled' }),
        }));
        global.fetch = fetchMock as unknown as typeof fetch;
        const controller = new AbortController();
        const promise = loadDatasetFile(file, 'token', 'csv', null, {
            signal: controller.signal,
        });
        controller.abort();
        await expect(promise).rejects.toThrow('upload_cancelled');
        expect(fetchMock).toHaveBeenCalledWith('/api/upload/cancel', {
            method: 'POST',
            headers: expect.objectContaining({
                Authorization: 'Bearer token',
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({ identifier: 'upload-id' }),
            signal: expect.any(AbortSignal),
        });
    });

    it('tells when the cancel came after the import was queued', async () => {
        global.fetch = jest.fn(async () => ({
            json: async () => ({ status: 'import_started' }),
        })) as unknown as typeof fetch;
        const controller = new AbortController();
        const promise = loadDatasetFile(file, 'token', 'csv', null, {
            signal: controller.signal,
        });
        controller.abort();
        await expect(promise).rejects.toThrow('upload_import_started');
    });

    it('ignores the progress reset by the cancel', () => {
        const onProgress = jest.fn();
        const controller = new AbortController();
        loadFile('/api/upload/csv', file, 'token', null, {
            onProgress,
            signal: controller.signal,
        }).catch(() => {});
        mockResumable.cancel.mockImplementation(() =>
            mockResumable.handlers.progress(),
        );
        controller.abort();
        expect(onProgress).not.toHaveBeenCalled();
    });

    it('stops listening to the signal once the upload ends', async () => {
        const controller = new AbortController();
        const remove = jest.spyOn(controller.signal, 'removeEventListener');
        const promise = loadFile('/api/upload/csv', file, 'token', null, {
            signal: controller.signal,
        });
        mockResumable.handlers.fileSuccess(file, 'done');
        await promise;
        expect(remove).toHaveBeenCalledWith('abort', expect.any(Function));
    });

    it('keeps the default resumable identifier without a signal', () => {
        loadFile('/api/upload/csv', file, 'token');
        const options = (Resumable as unknown as jest.Mock).mock.calls[0][0];
        expect(options.generateUniqueIdentifier).toBeUndefined();
        expect(options.testChunks).toBeUndefined();
    });

    it('gives each cancellable upload a unique identifier', () => {
        loadFile('/api/upload/csv', file, 'token', null, {
            signal: new AbortController().signal,
        });
        const { generateUniqueIdentifier, testChunks } = (
            Resumable as unknown as jest.Mock
        ).mock.calls[0][0];
        // a unique identifier is never resumed
        expect(testChunks).toBe(false);
        const first = generateUniqueIdentifier(file);
        expect(first).toMatch(/^[0-9a-zA-Z_-]+$/);
        expect(generateUniqueIdentifier(file)).not.toBe(first);
    });

    it('does not start when already aborted', async () => {
        const controller = new AbortController();
        controller.abort();
        await expect(
            loadFile('/api/upload/csv', file, 'token', null, {
                signal: controller.signal,
            }),
        ).rejects.toThrow('upload_cancelled');
        expect(mockResumable.upload).not.toHaveBeenCalled();
    });
});
