import { Readable } from 'stream';
// @ts-expect-error TS(2792): no type declarations for fetch-with-proxy
import fetchWithProxy from 'fetch-with-proxy';
import { catalogModelSchema, type CatalogModel } from '@lodex/common';
import models from '../../../../src/app/custom/models/models-catalog.json';

export const catalogModels: unknown = models;

const MAX_ARCHIVE_SIZE = 100 * 1024 * 1024;
const DOWNLOAD_TIMEOUT_MS = 60_000;

// Same rule as getDisplayableModels: only the first entry of a given id counts
export const findCatalogModel = (
    models: unknown,
    id: string,
    availableLoaders: string[],
): CatalogModel | null => {
    if (!Array.isArray(models)) {
        return null;
    }
    const entry = models.find((model) => model?.id === id);
    if (!entry) {
        return null;
    }
    const parsed = catalogModelSchema.safeParse(entry);
    if (!parsed.success || !availableLoaders.includes(parsed.data.loader)) {
        return null;
    }
    return parsed.data;
};

export const downloadModelArchive = async (
    url: string,
    // same fetch as the url imports: honors the proxy environment variables
    fetchImpl: typeof fetch = fetchWithProxy,
    maxBytes: number = MAX_ARCHIVE_SIZE,
): Promise<Readable & { filename: string }> => {
    const response = await fetchImpl(url, {
        signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
    });
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
    // Read the whole archive before returning, so that any download failure
    // (timeout, reset, oversized chunked body) rejects here, before the
    // current model gets wiped by restoreFields.
    // content-length may be absent (chunked): enforce the limit while reading
    // the body is a web stream (native fetch) or a node stream (fetch-with-proxy)
    const chunks: Buffer[] = [];
    let received = 0;
    for await (const chunk of response.body as unknown as AsyncIterable<Uint8Array>) {
        received += chunk.byteLength;
        if (received > maxBytes) {
            throw new Error('model_archive_too_large');
        }
        // a view on the chunk, without copying it
        chunks.push(
            Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength),
        );
    }
    const stream = Readable.from(chunks) as Readable & {
        filename: string;
    };
    // restoreFields only treats a stream as an archive when filename ends with .tar
    stream.filename = new URL(url).pathname.split('/').pop() ?? '';
    return stream;
};
