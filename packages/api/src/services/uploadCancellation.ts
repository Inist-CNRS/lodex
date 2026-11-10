import config from 'config';
import fs from 'fs';
import escapeRegExp from 'lodash/escapeRegExp';
import path from 'path';

// a relative upload dir is relative to the repository root
export const getUploadDir = (): string => {
    const uploadDir: string = config.get('uploadDir');
    return uploadDir.startsWith('/') ? uploadDir : `../../${uploadDir}`;
};

// A cancelled upload is marked by a file next to its chunks, so that its
// chunk requests still in flight (from any API process) are refused and
// its import, if already queued, does not run.
const getCancelledMarker = (filename: string) => `${filename}.cancelled`;
// written just before the import of an upload is queued: a cancel coming
// later is too late, the import runs (and needs the chunks)
const getQueuedMarker = (filename: string) => `${filename}.queued`;

// upload identifiers are unique: chunks and markers older than this belong
// to uploads that ended long ago (interrupted, failed or cancelled)
const STALE_UPLOAD_FILE_AGE_MS = 24 * 60 * 60 * 1000;

const exists = (file: string): Promise<boolean> =>
    fs.promises.access(file).then(
        () => true,
        () => false,
    );

export const isUploadCancelled = (filename: string) =>
    exists(getCancelledMarker(filename));

export const isUploadQueued = (filename: string) =>
    exists(getQueuedMarker(filename));

export const markUploadQueued = (filename: string) =>
    fs.promises.writeFile(getQueuedMarker(filename), '');

const isChunkOf = (prefix: string, entry: string) =>
    entry.startsWith(prefix) && /^\d+$/.test(entry.slice(prefix.length));

// the chunks of an upload are named `${filename}.${chunkNumber}`
export const removeUploadChunks = async (filename: string) => {
    const dir = path.dirname(filename);
    const prefix = `${path.basename(filename)}.`;
    const entries = await fs.promises.readdir(dir).catch(() => []);
    await Promise.all(
        entries
            .filter((entry) => isChunkOf(prefix, entry))
            .map((entry) =>
                fs.promises.unlink(path.join(dir, entry)).catch(() => {}),
            ),
    );
};

// removes the chunks and markers of a tenant's old uploads; the identifier
// starts with the file size, so another tenant named `${tenant}_…` never
// matches
export const removeStaleUploadFiles = async (dir: string, tenant: string) => {
    const pattern = new RegExp(
        `^${escapeRegExp(tenant)}_\\d+-[0-9a-zA-Z_-]*\\.(cancelled|queued|\\d+)$`,
    );
    const entries = await fs.promises.readdir(dir).catch(() => []);
    await Promise.all(
        entries
            .filter((entry) => pattern.test(entry))
            .map(async (entry) => {
                const file = path.join(dir, entry);
                const { mtimeMs } = await fs.promises.stat(file);
                if (Date.now() - mtimeMs > STALE_UPLOAD_FILE_AGE_MS) {
                    await fs.promises.unlink(file);
                }
            })
            .map((removal) => removal.catch(() => {})),
    );
};

export const markUploadCancelled = async (filename: string) => {
    await fs.promises.writeFile(getCancelledMarker(filename), '');
};
