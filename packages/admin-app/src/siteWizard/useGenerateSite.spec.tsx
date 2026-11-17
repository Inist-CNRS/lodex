import { type ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { type CatalogModel } from '@lodex/common';
import { Wrapper, getStore } from '../test-utils';
import { uploadDataset } from '../upload/uploadDataset';
import { stopSiteGeneration } from '../api/siteGeneration';
import { useGenerateSite } from './useGenerateSite';

jest.mock('../upload/uploadDataset', () => ({ uploadDataset: jest.fn() }));
jest.mock('../api/siteGeneration', () => ({ stopSiteGeneration: jest.fn() }));

const model: CatalogModel = {
    id: 'a',
    url: 'http://a.tar',
    loader: 'la',
    importTypes: ['file'],
};
const source = { type: 'url' as const, url: 'https://x' };
const fileSource = {
    type: 'file' as const,
    file: new File(['a'], 'a.csv'),
};

describe('useGenerateSite', () => {
    let client: QueryClient;

    const renderGenerateSite = () =>
        renderHook(() => useGenerateSite(), {
            wrapper: ({ children }: { children: ReactNode }) => (
                <Wrapper store={getStore()} client={client}>
                    {children}
                </Wrapper>
            ),
        });

    beforeEach(() => {
        jest.clearAllMocks();
        client = new QueryClient();
        jest.spyOn(client, 'invalidateQueries').mockResolvedValue();
        (uploadDataset as jest.Mock).mockResolvedValue(undefined);
        (stopSiteGeneration as jest.Mock).mockResolvedValue(undefined);
    });

    afterEach(() => {
        // @ts-expect-error TS2322
        window.onbeforeunload = undefined;
    });

    it('sends the data with the choice, the model loader and the site info', async () => {
        const { result } = renderGenerateSite();
        await act(() =>
            result.current.generate(model, source, {
                siteName: 'Site',
                siteDescription: 'Desc',
                theme: 'dark',
            }),
        );
        expect(uploadDataset).toHaveBeenCalledWith(
            source,
            'la',
            expect.objectContaining({
                choice: {
                    modelId: 'a',
                    siteName: 'Site',
                    siteDescription: 'Desc',
                    theme: 'dark',
                },
            }),
        );
        expect(result.current.isGenerating).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('sends only the model id without site info', async () => {
        const { result } = renderGenerateSite();
        await act(() => result.current.generate(model, source));
        expect(uploadDataset).toHaveBeenCalledWith(
            source,
            'la',
            expect.objectContaining({ choice: { modelId: 'a' } }),
        );
    });

    it('ends once the site generation query is invalidated', async () => {
        let refetched: () => void = () => {};
        jest.mocked(client.invalidateQueries).mockImplementation(
            () => new Promise<void>((resolve) => (refetched = resolve)),
        );
        const { result } = renderGenerateSite();
        let ended = false;
        await act(async () => {
            result.current.generate(model, source).then(() => {
                ended = true;
            });
        });
        expect(client.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ['site-generation'],
        });
        expect(ended).toBe(false);
        expect(result.current.isGenerating).toBe(true);
        await act(async () => refetched());
        expect(ended).toBe(true);
        expect(result.current.isGenerating).toBe(false);
    });

    it('does not invalidate the site generation when the upload fails', async () => {
        (uploadDataset as jest.Mock).mockRejectedValue(new Error('x'));
        const { result } = renderGenerateSite();
        await act(async () => {
            await result.current.generate(model, source).catch(() => {});
        });
        expect(client.invalidateQueries).not.toHaveBeenCalled();
    });

    it('sets the error when the server refuses the model', async () => {
        (uploadDataset as jest.Mock).mockRejectedValue(
            new Error('model_not_found'),
        );
        const { result } = renderGenerateSite();
        await act(async () => {
            await expect(
                result.current.generate(model, source),
            ).rejects.toThrow('model_not_found');
        });
        expect(result.current.error).toBe(
            'site_wizard_generation_error+{"error":"model_not_found"}',
        );
        expect(result.current.isGenerating).toBe(false);
    });

    it('translates the error codes', async () => {
        (uploadDataset as jest.Mock).mockRejectedValue(
            new Error('model_archive_not_tar'),
        );
        const { result } = renderGenerateSite();
        await act(async () => {
            await result.current.generate(model, source).catch(() => {});
        });
        expect(result.current.error).toBe(
            'site_wizard_generation_error+{"error":"model_archive_not_tar"}',
        );
    });

    it('clears the previous error on a new generation and on demand', async () => {
        (uploadDataset as jest.Mock).mockRejectedValueOnce(new Error('x'));
        const { result } = renderGenerateSite();
        await act(async () => {
            await result.current.generate(model, source).catch(() => {});
        });
        expect(result.current.error).not.toBeNull();
        act(() => result.current.clearError());
        expect(result.current.error).toBeNull();
        (uploadDataset as jest.Mock).mockRejectedValueOnce(new Error('y'));
        await act(async () => {
            await result.current.generate(model, source).catch(() => {});
        });
        expect(result.current.error).not.toBeNull();
        await act(() => result.current.generate(model, source));
        expect(result.current.error).toBeNull();
    });

    it('prevents unloading the page during a file upload only', async () => {
        let finishUpload: () => void = () => {};
        (uploadDataset as jest.Mock).mockImplementation(
            () => new Promise<void>((resolve) => (finishUpload = resolve)),
        );
        const { result } = renderGenerateSite();
        let promise: Promise<void> = Promise.resolve();
        await act(async () => {
            promise = result.current.generate(model, fileSource);
        });
        expect(window.onbeforeunload).toBeTruthy();
        await act(async () => {
            finishUpload();
            await promise;
        });
        expect(window.onbeforeunload).toBeFalsy();
    });

    it('does not prevent unloading the page for an url', async () => {
        let finishUpload: () => void = () => {};
        (uploadDataset as jest.Mock).mockImplementation(
            () => new Promise<void>((resolve) => (finishUpload = resolve)),
        );
        const { result } = renderGenerateSite();
        let promise: Promise<void> = Promise.resolve();
        await act(async () => {
            promise = result.current.generate(model, source);
        });
        expect(window.onbeforeunload).toBeFalsy();
        expect(result.current.canCancel).toBe(false);
        await act(async () => {
            finishUpload();
            await promise;
        });
    });

    describe('with a file', () => {
        it('reports the upload progress, which can be cancelled until it ends', async () => {
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
            const { result } = renderGenerateSite();
            let promise: Promise<void> = Promise.resolve();
            await act(async () => {
                promise = result.current.generate(model, fileSource);
            });
            expect(result.current.uploadProgress).toBe(0);
            expect(result.current.canCancel).toBe(true);
            act(() => report(0.424));
            expect(result.current.uploadProgress).toBe(42);
            await act(async () => {
                finishUpload();
                await promise;
            });
            expect(result.current.uploadProgress).toBeNull();
            expect(result.current.canCancel).toBe(false);
        });

        it('stops the upload on cancel, without error', async () => {
            let signal: AbortSignal | undefined;
            (uploadDataset as jest.Mock).mockImplementation(
                (_source, _loader, options) => {
                    signal = options.signal;
                    return new Promise<void>((_, reject) =>
                        options.signal.addEventListener('abort', () =>
                            reject(new Error('upload_cancelled')),
                        ),
                    );
                },
            );
            const { result } = renderGenerateSite();
            let promise: Promise<void> = Promise.resolve();
            await act(async () => {
                promise = result.current
                    .generate(model, fileSource)
                    .catch(() => {});
            });
            await act(async () => {
                await result.current.cancelImport();
            });
            expect(signal?.aborted).toBe(true);
            await act(async () => {
                await promise;
            });
            expect(result.current.error).toBeNull();
            expect(result.current.isGenerating).toBe(false);
            expect(result.current.isCancelling).toBe(false);
            expect(result.current.uploadProgress).toBeNull();
            expect(client.invalidateQueries).not.toHaveBeenCalled();
        });

        // the server answers so when the cancel came after the last chunk
        // queued the import, which started the generation
        const importStartedOnCancel = () => {
            (uploadDataset as jest.Mock).mockImplementation(
                (_source, _loader, options) =>
                    new Promise<void>((_, reject) =>
                        options.signal.addEventListener('abort', () =>
                            reject(new Error('upload_import_started')),
                        ),
                    ),
            );
        };

        const cancelDuringUpload = async (
            result: ReturnType<typeof renderGenerateSite>['result'],
        ) => {
            let outcome: 'handedOver' | 'cancelled' | undefined;
            let promise: Promise<void> = Promise.resolve();
            await act(async () => {
                promise = result.current.generate(model, fileSource).then(
                    () => {
                        outcome = 'handedOver';
                    },
                    () => {
                        outcome = 'cancelled';
                    },
                );
            });
            await act(async () => {
                await result.current.cancelImport();
                await promise;
            });
            return outcome;
        };

        it('stops the generation when the cancel came after the last chunk queued the import', async () => {
            importStartedOnCancel();
            const { result } = renderGenerateSite();

            const outcome = await cancelDuringUpload(result);

            expect(stopSiteGeneration).toHaveBeenCalledTimes(1);
            // ends as a cancel: no error, the wizard is not handed over
            expect(outcome).toBe('cancelled');
            expect(result.current.error).toBeNull();
            expect(result.current.isGenerating).toBe(false);
            expect(result.current.isCancelling).toBe(false);
            expect(client.invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['site-generation'],
            });
        });

        it('ends as a cancel when the generation is already over', async () => {
            importStartedOnCancel();
            const conflict = Object.assign(new Error('conflict'), {
                code: 409,
            });
            (stopSiteGeneration as jest.Mock).mockRejectedValue(conflict);
            const { result } = renderGenerateSite();

            const outcome = await cancelDuringUpload(result);

            expect(outcome).toBe('cancelled');
            expect(result.current.error).toBeNull();
        });

        it('hands the generation over when it cannot be stopped', async () => {
            importStartedOnCancel();
            (stopSiteGeneration as jest.Mock).mockRejectedValue(
                new Error('boom'),
            );
            const { result } = renderGenerateSite();

            const outcome = await cancelDuringUpload(result);

            // the progress dialog still lets it be stopped
            expect(outcome).toBe('handedOver');
            expect(result.current.error).toBeNull();
            expect(client.invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['site-generation'],
            });
        });

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
            expect(signal?.aborted).toBe(false);
            expect(window.onbeforeunload).toBeFalsy();
        });
    });
});
