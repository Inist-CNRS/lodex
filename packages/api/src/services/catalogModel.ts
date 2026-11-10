import { Readable } from 'stream';
// @ts-expect-error TS(2792): no type declarations for fetch-with-proxy
import fetchWithProxy from 'fetch-with-proxy';
import { getDisplayableModels, type CatalogModel } from '@lodex/common';
import models from '../../../../src/app/custom/models/models-catalog.json';

export const catalogModels: unknown = models;

const MAX_ARCHIVE_SIZE = 100 * 1024 * 1024;
const DOWNLOAD_TIMEOUT_MS = 60_000;

// The rule of the admin wizard (getDisplayableModels), except that the
// translations are a display concern: the server accepts an untranslated
// model.
export const findCatalogModel = (
    models: unknown,
    id: string,
    availableLoaders: string[],
): CatalogModel | null =>
    getDisplayableModels(models, {
        availableLoaders,
        hasTranslation: () => true,
    }).find((model) => model.id === id) ?? null;

type ArchiveBody = AsyncIterable<Uint8Array> & {
    // node stream (fetch-with-proxy)
    destroy?: () => void;
    // web stream (native fetch)
    cancel?: () => Promise<void>;
};

const readArchive = async (
    url: string,
    fetchImpl: typeof fetch,
    maxBytes: number,
    signal: AbortSignal,
    timeoutMs: number,
    onBody: (body: ArchiveBody) => void,
): Promise<Buffer[]> => {
    const response = await fetchImpl(url, {
        // native fetch
        signal,
        // fetch-with-proxy runs on node-fetch 1, which ignores signal; its own
        // timeout only covers the wait for the response headers
        timeout: timeoutMs,
    } as RequestInit);
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    const contentLength = Number(response.headers.get('content-length'));
    if (contentLength > maxBytes) {
        throw new Error('model_archive_too_large');
    }
    if (!response.body) {
        throw new Error('model_archive_empty');
    }
    const body = response.body as unknown as ArchiveBody;
    onBody(body);
    // content-length may be absent (chunked): enforce the limit while reading
    const chunks: Buffer[] = [];
    let received = 0;
    for await (const chunk of body) {
        received += chunk.byteLength;
        if (received > maxBytes) {
            throw new Error('model_archive_too_large');
        }
        // a view on the chunk, without copying it
        chunks.push(
            Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength),
        );
    }
    return chunks;
};

export const downloadModelArchive = async (
    url: string,
    // same fetch as the url imports: honors the proxy environment variables
    fetchImpl: typeof fetch = fetchWithProxy,
    maxBytes: number = MAX_ARCHIVE_SIZE,
    timeoutMs: number = DOWNLOAD_TIMEOUT_MS,
): Promise<Readable & { filename: string }> => {
    // Read the whole archive before returning, so that any download failure
    // (timeout, reset, oversized chunked body) rejects here, before the
    // current model gets wiped by restoreFields.
    // A single deadline covers the whole download, the body included: no
    // fetch timeout stops a host that sends the headers then stalls.
    const controller = new AbortController();
    let body: ArchiveBody | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const deadline = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
            controller.abort();
            body?.destroy?.();
            body?.cancel?.().catch(() => {});
            reject(new Error('model_archive_download_timeout'));
        }, timeoutMs);
    });
    const download = readArchive(
        url,
        fetchImpl,
        maxBytes,
        controller.signal,
        timeoutMs,
        (readBody) => {
            body = readBody;
            // the headers came after the deadline: drop the body right away
            if (controller.signal.aborted) {
                readBody.destroy?.();
                readBody.cancel?.().catch(() => {});
            }
        },
    );
    // the losing promise must not end as an unhandled rejection
    download.catch(() => {});
    let chunks: Buffer[];
    try {
        chunks = await Promise.race([download, deadline]);
    } finally {
        clearTimeout(timer);
    }
    const stream = Readable.from(chunks) as Readable & {
        filename: string;
    };
    // restoreFields only treats a stream as an archive when filename ends with .tar
    stream.filename = new URL(url).pathname.split('/').pop() ?? '';
    return stream;
};
