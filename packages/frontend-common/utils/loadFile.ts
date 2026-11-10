// @ts-expect-error TS2306
import Resumable from '@recuperateur/resumablejs';
import { DEFAULT_TENANT } from '@lodex/common';

export type LoadFileOptions = {
    // the uploaded fraction of the file, from 0 to 1
    onProgress?: (progress: number) => void;
    // aborting stops the upload, which rejects with upload_cancelled
    signal?: AbortSignal;
    // told about an aborted upload, so that the server drops it
    cancelUrl?: string;
};

// how long a cancel waits for the server to tell whether it was in time
const CANCEL_REQUEST_TIMEOUT_MS = 5000;

// unique per cancellable upload: a later upload of the same file never
// reuses the chunks of a cancelled one. No underscore: the server tells the
// files of a tenant from another's by it (see removeStaleUploadFiles)
// @ts-expect-error TS7006
const generateUploadIdentifier = (file) =>
    [
        file.size,
        file.name.replace(/[^0-9a-zA-Z-]/g, ''),
        Date.now(),
        Math.random().toString(36).slice(2),
    ].join('-');

export const loadFile = (
    // @ts-expect-error TS7006
    url,
    // @ts-expect-error TS7006
    file,
    // @ts-expect-error TS7006
    token,
    customLoader = null,
    { onProgress, signal, cancelUrl }: LoadFileOptions = {},
) =>
    new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(new Error('upload_cancelled'));
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            'X-Lodex-Tenant':
                sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT,
        };
        const options = {
            target: url,
            headers,
            multipart: true,
            // the other uploads keep resuming from the chunks already sent
            ...(signal
                ? {
                      generateUniqueIdentifier: generateUploadIdentifier,
                      // a unique identifier is never resumed
                      testChunks: false,
                  }
                : {}),
        };

        if (customLoader) {
            // @ts-expect-error TS2339
            options.query = {
                customLoader,
            };
        }

        const resumable = new Resumable(options);
        let identifier: string | null = null;
        let isAborted = false;

        const onAbort = async () => {
            isAborted = true;
            resumable.cancel();
            let outcome = 'upload_cancelled';
            if (cancelUrl && identifier) {
                const timeout = new AbortController();
                const timer = setTimeout(
                    () => timeout.abort(),
                    CANCEL_REQUEST_TIMEOUT_MS,
                );
                try {
                    const response = await fetch(cancelUrl, {
                        method: 'POST',
                        headers: {
                            ...headers,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ identifier }),
                        signal: timeout.signal,
                    });
                    const { status } = await response.json();
                    // the last chunk had already queued the import
                    if (status === 'import_started') {
                        outcome = 'upload_import_started';
                    }
                } catch {
                    // the upload is stopped on this side anyway
                } finally {
                    clearTimeout(timer);
                }
            }
            reject(new Error(outcome));
        };
        const stopListening = () =>
            signal?.removeEventListener('abort', onAbort);

        // @ts-expect-error TS7006
        resumable.on('fileSuccess', (_, message) => {
            stopListening();
            resolve(message);
        });
        // @ts-expect-error TS7006
        resumable.on('error', (_, error) => {
            stopListening();
            reject(error);
        });

        // @ts-expect-error TS7006
        resumable.on('fileAdded', (addedFile) => {
            identifier = addedFile.uniqueIdentifier;
            resumable.upload();
        });
        if (onProgress) {
            // cancelling resets the progress: ignore it
            resumable.on('progress', () => {
                if (!isAborted) {
                    onProgress(resumable.progress());
                }
            });
        }
        signal?.addEventListener('abort', onAbort, { once: true });
        resumable.addFile(file);
    });

export const loadDatasetFile = (
    // @ts-expect-error TS7006
    file,
    // @ts-expect-error TS7006
    token,
    // @ts-expect-error TS7006
    loaderName,
    // @ts-expect-error TS7006
    customLoader,
    options?: LoadFileOptions,
) => {
    const extension = loaderName || file.name.split('.').pop();
    const url = `/api/upload/${extension}`;

    return loadFile(url, file, token, customLoader, {
        ...options,
        cancelUrl: '/api/upload/cancel',
    });
};

// @ts-expect-error TS7006
export const loadModelFile = (file, token) =>
    loadFile('/api/field/import', file, token);
