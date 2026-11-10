import { type ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { toast, type CatalogModel } from '@lodex/common';
import { LOAD_FIELD } from '@lodex/frontend-common/fields/reducer';
import { Wrapper, getStore } from '../test-utils';
import { importCatalogModel } from '../api/field';
import jobsApi from '../api/job';
import { LOAD_ENRICHMENTS } from '../enrichment';
import { LOAD_PRECOMPUTED } from '../precomputed';
import { LOAD_PUBLICATION } from '../publication';
import { LOAD_SUBRESOURCES } from '../subresource';
import { clearDataset, uploadDataset } from '../upload/uploadDataset';
import { useImportJobEnd } from './useImportJobEnd';
import { useGenerateSite } from './useGenerateSite';

jest.mock('../api/field', () => ({ importCatalogModel: jest.fn() }));
jest.mock('../upload/uploadDataset', () => ({
    uploadDataset: jest.fn(),
    clearDataset: jest.fn(),
}));
jest.mock('./useImportJobEnd', () => ({ useImportJobEnd: jest.fn() }));
jest.mock('../api/job', () => ({
    __esModule: true,
    default: { cancelJob: jest.fn() },
}));
jest.mock('@lodex/common', () => ({
    ...jest.requireActual('@lodex/common'),
    toast: jest.fn(),
}));

const RELOAD_ACTIONS = [
    LOAD_FIELD,
    LOAD_PUBLICATION,
    LOAD_SUBRESOURCES,
    LOAD_ENRICHMENTS,
    LOAD_PRECOMPUTED,
];

const model: CatalogModel = { id: 'a', url: 'http://a.tar', loader: 'la' };
const source = { type: 'url' as const, url: 'https://x' };

describe('useGenerateSite', () => {
    let calls: string[];
    let waitForImportEnd: jest.Mock;
    let connect: jest.Mock;
    const stopWaitingForImportEnd = jest.fn();
    const giveUpWaitingForImportEnd = jest.fn();
    let client: QueryClient;
    let dispatched: string[];

    const renderGenerateSite = () => {
        const store = getStore();
        // record the actions without running their sagas
        jest.spyOn(store, 'dispatch').mockImplementation((action) => {
            dispatched.push(action.type);
            return action;
        });
        return renderHook(() => useGenerateSite(), {
            wrapper: ({ children }: { children: ReactNode }) => (
                <Wrapper store={store} client={client}>
                    {children}
                </Wrapper>
            ),
        });
    };

    beforeEach(() => {
        stopWaitingForImportEnd.mockClear();
        giveUpWaitingForImportEnd.mockClear();
        jest.clearAllMocks();
        calls = [];
        dispatched = [];
        client = new QueryClient();
        jest.spyOn(client, 'invalidateQueries').mockResolvedValue();
        jest.spyOn(client, 'resetQueries').mockImplementation(async () => {
            calls.push('resetQueries');
        });
        (importCatalogModel as jest.Mock).mockImplementation(async () => {
            calls.push('importCatalogModel');
            return {};
        });
        (uploadDataset as jest.Mock).mockImplementation(async () => {
            calls.push('uploadDataset');
        });
        waitForImportEnd = jest.fn(async () => {
            calls.push('waitForImportEnd');
        });
        connect = jest.fn(async () => {
            calls.push('connected');
        });
        // the mocked waitForImportEnd gives the import end promise
        (useImportJobEnd as jest.Mock).mockReturnValue({
            waitForImportEnd: () => ({
                ended: waitForImportEnd(),
                connected: connect(),
            }),
            stopWaitingForImportEnd,
            giveUpWaitingForImportEnd,
        });
    });

    afterEach(() => {
        // @ts-expect-error TS2322
        window.onbeforeunload = undefined;
    });

    it('imports the data with the model loader, then the model', async () => {
        const { result } = renderGenerateSite();
        await act(() => result.current.generate(model, source));
        // listens to the job end before uploading, then imports the model
        // once the data is there
        expect(calls).toEqual([
            'waitForImportEnd',
            'connected',
            'uploadDataset',
            'importCatalogModel',
            'resetQueries',
        ]);
        expect(importCatalogModel).toHaveBeenCalledWith('a');
        expect(client.resetQueries).toHaveBeenCalledWith({
            queryKey: ['get-config-tenant'],
        });
        expect(uploadDataset).toHaveBeenCalledWith(source, 'la');
        expect(result.current.isGenerating).toBe(false);
        expect(result.current.error).toBeNull();
        expect(toast).not.toHaveBeenCalled();
    });

    it('uploads the data only once the import socket is connected', async () => {
        let connected: () => void = () => {};
        connect.mockImplementation(
            () => new Promise<void>((resolve) => (connected = resolve)),
        );
        const { result } = renderGenerateSite();
        let promise: Promise<void> = Promise.resolve();
        await act(async () => {
            promise = result.current.generate(model, source);
        });
        expect(uploadDataset).not.toHaveBeenCalled();
        await act(async () => {
            connected();
            await promise;
        });
        expect(uploadDataset).toHaveBeenCalled();
    });

    it('completes when the import ends before the upload request resolves', async () => {
        // emulates useImportJobEnd: an end event is dropped when no wait is pending
        let pending: (() => void) | null = null;
        waitForImportEnd.mockImplementation(
            () =>
                new Promise<void>((resolve) => {
                    pending = resolve;
                }),
        );
        (uploadDataset as jest.Mock).mockImplementation(async () => {
            const end = pending;
            pending = null;
            end?.();
        });
        const { result } = renderGenerateSite();
        let done = false;
        await act(async () => {
            result.current.generate(model, source).then(() => {
                done = true;
            });
        });
        expect(done).toBe(true);
        expect(result.current.isGenerating).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('sets the error when the upload fails, without unhandled rejection from the pending wait', async () => {
        let rejectWait: (error: Error) => void = () => {};
        waitForImportEnd.mockImplementation(
            () =>
                new Promise<void>((_, reject) => {
                    rejectWait = reject;
                }),
        );
        (uploadDataset as jest.Mock).mockRejectedValue(new Error('upload'));
        const { result } = renderGenerateSite();
        await act(async () => {
            await expect(
                result.current.generate(model, source),
            ).rejects.toThrow('upload');
        });
        expect(result.current.error).toBe(
            'site_wizard_generation_error+{"error":"upload"}',
        );
        expect(result.current.isGenerating).toBe(false);
        expect(window.onbeforeunload).toBeFalsy();
        // nobody awaits the import end anymore: stop listening
        expect(stopWaitingForImportEnd).toHaveBeenCalled();
        // a later end event settling the abandoned wait must be harmless
        rejectWait(new Error('import_failed'));
        await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('prevents unloading the page during the generation only', async () => {
        let unloadDuringImport: unknown;
        waitForImportEnd.mockImplementation(async () => {
            unloadDuringImport = window.onbeforeunload;
        });
        const { result } = renderGenerateSite();
        await act(() => result.current.generate(model, source));
        expect(unloadDuringImport).toBeInstanceOf(Function);
        expect(window.onbeforeunload).toBeFalsy();
    });

    it('warns when the recommended theme is not found and goes on', async () => {
        (importCatalogModel as jest.Mock).mockResolvedValue({
            hasEnrichments: false,
            hasPrecomputed: false,
            themeNotFound: 'istex',
        });
        const { result } = renderGenerateSite();
        await act(() => result.current.generate(model, source));
        expect(toast).toHaveBeenCalledWith(
            'site_wizard_theme_not_found+{"theme":"istex"}',
            { type: 'warning' },
        );
        expect(uploadDataset).toHaveBeenCalled();
        expect(waitForImportEnd).toHaveBeenCalled();
        expect(result.current.error).toBeNull();
    });

    it('sets the error when the model import fails after the data', async () => {
        (importCatalogModel as jest.Mock).mockRejectedValue(new Error('boom'));
        const { result } = renderGenerateSite();
        await act(async () => {
            await expect(
                result.current.generate(model, source),
            ).rejects.toThrow('boom');
        });
        expect(uploadDataset).toHaveBeenCalled();
        expect(result.current.error).toBe(
            'site_wizard_generation_error+{"error":"boom"}',
        );
        expect(result.current.isGenerating).toBe(false);
        expect(window.onbeforeunload).toBeFalsy();
    });

    it('only imports the model again on a retry after a failed model import', async () => {
        (importCatalogModel as jest.Mock).mockRejectedValueOnce(
            new Error('boom'),
        );
        const { result } = renderGenerateSite();
        await act(async () => {
            await result.current.generate(model, source).catch(() => {});
        });
        await act(() => result.current.generate(model, source));
        // the data is not uploaded twice
        expect(uploadDataset).toHaveBeenCalledTimes(1);
        expect(importCatalogModel).toHaveBeenCalledTimes(2);
        expect(result.current.error).toBeNull();
    });

    it('replaces the imported data when a retry gives other data', async () => {
        (importCatalogModel as jest.Mock).mockRejectedValueOnce(
            new Error('boom'),
        );
        const { result } = renderGenerateSite();
        await act(async () => {
            await result.current.generate(model, source).catch(() => {});
        });
        expect(clearDataset).not.toHaveBeenCalled();
        const otherSource = { type: 'url' as const, url: 'https://other' };
        await act(() => result.current.generate(model, otherSource));
        expect(clearDataset).toHaveBeenCalledTimes(1);
        expect(uploadDataset).toHaveBeenCalledTimes(2);
        expect(uploadDataset).toHaveBeenLastCalledWith(otherSource, 'la');
    });

    it('cannot cancel during the model import, once the data is imported', async () => {
        let finishModel: () => void = () => {};
        (importCatalogModel as jest.Mock).mockImplementation(
            () => new Promise((resolve) => (finishModel = () => resolve({}))),
        );
        const { result } = renderGenerateSite();
        let promise: Promise<void> = Promise.resolve();
        await act(async () => {
            promise = result.current.generate(model, source);
        });
        expect(result.current.isGenerating).toBe(true);
        expect(result.current.canCancel).toBe(false);
        await act(async () => {
            finishModel();
            await promise;
        });
    });

    it('is cancelling from the click on cancel to the end of the generation', async () => {
        let failImport: (error: Error) => void = () => {};
        waitForImportEnd.mockImplementation(
            () => new Promise<void>((_, reject) => (failImport = reject)),
        );
        const { result } = renderGenerateSite();
        let promise: Promise<void> = Promise.resolve();
        await act(async () => {
            promise = result.current.generate(model, source);
        });
        expect(result.current.isCancelling).toBe(false);
        await act(() => result.current.cancelImport());
        expect(result.current.isCancelling).toBe(true);
        await act(async () => {
            failImport(new Error('cancelled_import'));
            await promise.catch(() => {});
        });
        expect(result.current.isCancelling).toBe(false);
    });

    it('does not import the model when the data import fails', async () => {
        waitForImportEnd.mockRejectedValue(new Error('import_failed'));
        const { result } = renderGenerateSite();
        await act(async () => {
            await result.current.generate(model, source).catch(() => {});
        });
        // the instance is left as it was: the generation can be retried
        expect(importCatalogModel).not.toHaveBeenCalled();
        expect(result.current.error).not.toBeNull();
    });

    it('sets no error when the user cancels the import', async () => {
        waitForImportEnd.mockRejectedValue(new Error('cancelled_import'));
        const { result } = renderGenerateSite();
        await act(async () => {
            await expect(
                result.current.generate(model, source),
            ).rejects.toThrow('cancelled_import');
        });
        expect(result.current.error).toBeNull();
        expect(result.current.isGenerating).toBe(false);
    });

    it('is generating while the job runs and clears the previous error', async () => {
        waitForImportEnd.mockRejectedValueOnce(new Error('import_failed'));
        const { result } = renderGenerateSite();
        await act(async () => {
            await result.current.generate(model, source).catch(() => {});
        });
        expect(result.current.error).not.toBeNull();
        let end: () => void = () => {};
        waitForImportEnd.mockImplementation(
            () => new Promise<void>((resolve) => (end = resolve)),
        );
        let promise: Promise<void> = Promise.resolve();
        await act(async () => {
            promise = result.current.generate(model, source);
        });
        expect(result.current.isGenerating).toBe(true);
        expect(result.current.error).toBeNull();
        await act(async () => {
            end();
            await promise;
        });
        expect(result.current.isGenerating).toBe(false);
    });

    it('reloads the admin data once the generation succeeds', async () => {
        const { result } = renderGenerateSite();
        await act(() => result.current.generate(model, source));
        expect(dispatched).toEqual(RELOAD_ACTIONS);
        expect(client.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ['fetchPrecomputations'],
        });
    });

    it.each([
        [
            'the model import',
            () =>
                (importCatalogModel as jest.Mock).mockRejectedValue(
                    new Error('x'),
                ),
        ],
        [
            'the upload',
            () =>
                (uploadDataset as jest.Mock).mockRejectedValue(new Error('x')),
        ],
        [
            'the import job',
            () => waitForImportEnd.mockRejectedValue(new Error('x')),
        ],
    ])(
        // the server may have replaced the model, or deleted it before failing
        'reloads the admin data when %s fails',
        async (_, fail) => {
            fail();
            const { result } = renderGenerateSite();
            await act(async () => {
                await result.current.generate(model, source).catch(() => {});
            });
            expect(dispatched).toEqual(RELOAD_ACTIONS);
            expect(client.invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['fetchPrecomputations'],
            });
        },
    );

    it('clears the error on demand', async () => {
        (uploadDataset as jest.Mock).mockRejectedValue(new Error('x'));
        const { result } = renderGenerateSite();
        await act(async () => {
            await result.current.generate(model, source).catch(() => {});
        });
        expect(result.current.error).not.toBeNull();
        act(() => result.current.clearError());
        expect(result.current.error).toBeNull();
    });

    it('is waiting for the import only once the data is uploaded', async () => {
        let end: () => void = () => {};
        let finishUpload: () => void = () => {};
        (uploadDataset as jest.Mock).mockImplementation(
            () => new Promise<void>((resolve) => (finishUpload = resolve)),
        );
        waitForImportEnd.mockImplementation(
            () => new Promise<void>((resolve) => (end = resolve)),
        );
        const { result } = renderGenerateSite();
        let promise: Promise<void> = Promise.resolve();
        await act(async () => {
            promise = result.current.generate(model, source);
        });
        expect(result.current.isGenerating).toBe(true);
        expect(result.current.isWaitingForImport).toBe(false);
        await act(async () => finishUpload());
        expect(result.current.isWaitingForImport).toBe(true);
        await act(async () => {
            end();
            await promise;
        });
        expect(result.current.isWaitingForImport).toBe(false);
    });

    it('sets no error when a cancelled import ends as a plain failure', async () => {
        let fail: (error: Error) => void = () => {};
        waitForImportEnd.mockImplementation(
            () => new Promise<void>((_, reject) => (fail = reject)),
        );
        const { result } = renderGenerateSite();
        let promise: Promise<void> = Promise.resolve();
        await act(async () => {
            promise = result.current.generate(model, source);
        });
        await act(() => result.current.cancelImport());
        await act(async () => {
            // the server stops the stream, then reports a failure without message
            fail(new Error('import_failed'));
            await promise.catch(() => {});
        });
        expect(result.current.error).toBeNull();
    });

    it('reports a failure of the next generation after a cancel', async () => {
        const { result } = renderGenerateSite();
        await act(() => result.current.cancelImport());
        waitForImportEnd.mockRejectedValue(new Error('import_failed'));
        await act(async () => {
            await result.current.generate(model, source).catch(() => {});
        });
        expect(result.current.error).not.toBeNull();
    });

    it('cancels the import job, then gives up waiting if its end never comes', async () => {
        const { result } = renderGenerateSite();
        await act(() => result.current.cancelImport());
        expect(jobsApi.cancelJob).toHaveBeenCalledWith('import', undefined);
        // the server answers before stopping the job: its end is still awaited
        expect(stopWaitingForImportEnd).not.toHaveBeenCalled();
        expect(giveUpWaitingForImportEnd).toHaveBeenCalledWith(
            15_000,
            new Error('cancelled_import'),
        );
    });

    describe('with a file', () => {
        const fileSource = {
            type: 'file' as const,
            file: new File(['a'], 'a.csv'),
        };

        it('keeps uploading when unmounted', async () => {
            let signal: AbortSignal | undefined;
            (uploadDataset as jest.Mock).mockImplementation(
                (_source, _loader, options) => {
                    signal = options.signal;
                    return new Promise(() => {});
                },
            );
            const { result, unmount } = renderGenerateSite();
            await act(async () => {
                result.current.generate(model, fileSource).catch(() => {});
            });
            unmount();
            // leaving the data screens must not drop the dataset silently
            expect(signal?.aborted).toBe(false);
        });

        it('reports the upload progress until the file is uploaded', async () => {
            let report: (progress: number) => void = () => {};
            let finishUpload: () => void = () => {};
            (uploadDataset as jest.Mock).mockImplementation(
                (_source, _loader, { onProgress }) => {
                    report = onProgress;
                    return new Promise<void>(
                        (resolve) => (finishUpload = resolve),
                    );
                },
            );
            waitForImportEnd.mockImplementation(() => new Promise(() => {}));
            const { result } = renderGenerateSite();
            await act(async () => {
                result.current.generate(model, fileSource);
            });
            expect(result.current.uploadProgress).toBe(0);
            expect(result.current.canCancel).toBe(true);
            act(() => report(0.424));
            expect(result.current.uploadProgress).toBe(42);
            await act(async () => finishUpload());
            expect(result.current.uploadProgress).toBeNull();
            // the import job now runs: it can still be cancelled
            expect(result.current.canCancel).toBe(true);
        });

        it('stops the upload on cancel, without error nor waiting fallback', async () => {
            (uploadDataset as jest.Mock).mockImplementation(
                (_source, _loader, { signal }) =>
                    new Promise<void>((_, reject) =>
                        signal.addEventListener('abort', () =>
                            reject(new Error('upload_cancelled')),
                        ),
                    ),
            );
            const { result } = renderGenerateSite();
            let promise: Promise<void> = Promise.resolve();
            await act(async () => {
                promise = result.current.generate(model, fileSource);
            });
            await act(async () => {
                await result.current.cancelImport();
                await promise.catch(() => {});
            });
            // loadFile tells the server to drop the upload: no job to cancel
            expect(jobsApi.cancelJob).not.toHaveBeenCalled();
            expect(giveUpWaitingForImportEnd).not.toHaveBeenCalled();
            expect(importCatalogModel).not.toHaveBeenCalled();
            expect(result.current.error).toBeNull();
            expect(result.current.isGenerating).toBe(false);
            expect(result.current.uploadProgress).toBeNull();
        });
    });

    it('cancels the import queued by the last chunk when the cancel comes too late', async () => {
        const fileSource = {
            type: 'file' as const,
            file: new File(['a'], 'a.csv'),
        };
        let failImport: (error: Error) => void = () => {};
        waitForImportEnd.mockImplementation(
            () => new Promise<void>((_, reject) => (failImport = reject)),
        );
        (uploadDataset as jest.Mock).mockImplementation(
            (_source, _loader, { signal }) =>
                new Promise<void>((_, reject) =>
                    signal.addEventListener('abort', () =>
                        reject(new Error('upload_import_started')),
                    ),
                ),
        );
        const { result } = renderGenerateSite();
        let promise: Promise<void> = Promise.resolve();
        await act(async () => {
            promise = result.current.generate(model, fileSource);
        });
        await act(() => result.current.cancelImport());
        // cancelled as a running import, whose end is still awaited
        expect(jobsApi.cancelJob).toHaveBeenCalledWith('import', undefined);
        expect(giveUpWaitingForImportEnd).toHaveBeenCalled();
        expect(result.current.isGenerating).toBe(true);
        await act(async () => {
            failImport(new Error('cancelled_import'));
            await promise.catch(() => {});
        });
        expect(result.current.error).toBeNull();
        expect(importCatalogModel).not.toHaveBeenCalled();
    });

    it('still gives up waiting when the cancel request fails', async () => {
        (jobsApi.cancelJob as jest.Mock).mockRejectedValueOnce(
            new Error('network'),
        );
        const { result } = renderGenerateSite();
        await act(() => result.current.cancelImport());
        expect(giveUpWaitingForImportEnd).toHaveBeenCalled();
    });

    it('translates the error codes', async () => {
        (importCatalogModel as jest.Mock).mockRejectedValue(
            new Error('model_archive_too_large'),
        );
        const { result } = renderGenerateSite();
        await act(async () => {
            await result.current.generate(model, source).catch(() => {});
        });
        expect(result.current.error).toBe(
            'site_wizard_generation_error+{"error":"model_archive_too_large"}',
        );
    });
});
