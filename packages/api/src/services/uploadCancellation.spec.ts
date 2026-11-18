import fs from 'fs';
import os from 'os';
import path from 'path';
import {
    claimUploadImport,
    isUploadCancelled,
    markUploadCancelled,
    removeStaleUploadFiles,
    isUploadQueued,
    markUploadQueued,
    removeUploadQueuedMarker,
    removeUploadChunks,
} from './uploadCancellation';

describe('uploadCancellation', () => {
    let dir: string;

    const write = (file: string, ageMs = 0) => {
        const filePath = path.join(dir, file);
        fs.writeFileSync(filePath, 'x');
        const time = (Date.now() - ageMs) / 1000;
        fs.utimesSync(filePath, time, time);
    };
    const DAY_MS = 24 * 60 * 60 * 1000;

    beforeEach(async () => {
        dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'upload-'));
    });

    afterEach(async () => {
        await fs.promises.rm(dir, { recursive: true, force: true });
    });

    it('marks an upload as cancelled', async () => {
        const filename = path.join(dir, 'lodex_test_id');
        expect(await isUploadCancelled(filename)).toBe(false);
        await markUploadCancelled(filename);
        expect(await isUploadCancelled(filename)).toBe(true);
        expect(await isUploadCancelled(path.join(dir, 'other'))).toBe(false);
    });

    it('marks an upload as queued, until its import ends', async () => {
        const filename = path.join(dir, 'lodex_test_id');
        expect(await isUploadQueued(filename)).toBe(false);
        await markUploadQueued(filename);
        expect(await isUploadQueued(filename)).toBe(true);
        await removeUploadQueuedMarker(filename);
        expect(await isUploadQueued(filename)).toBe(false);
    });

    it('lets a single request claim the import of an upload', async () => {
        const filename = path.join(dir, 'lodex_test_id');
        const claims = await Promise.all([
            claimUploadImport(filename),
            claimUploadImport(filename),
            claimUploadImport(filename),
        ]);
        expect(claims.filter(Boolean)).toHaveLength(1);
        expect(await claimUploadImport(path.join(dir, 'other'))).toBe(true);
        // kept once the import ended: a late retry does not import again
        await removeUploadQueuedMarker(filename);
        expect(await claimUploadImport(filename)).toBe(false);
    });

    it("never removes the files of a tenant whose name extends this one's", async () => {
        const old = DAY_MS + 60_000;
        // the files of a tenant named "a_1-b", which tenant "a" would match
        // if the identifiers had underscores
        write('a_1-b_12-datacsv-1700000000000-x.1', old);
        write('a_12-datacsv-1700000000000-x.1', old);
        await removeStaleUploadFiles(dir, 'a');
        expect(await fs.promises.readdir(dir)).toEqual([
            'a_1-b_12-datacsv-1700000000000-x.1',
        ]);
    });

    it('removes only the chunks of the upload', async () => {
        [
            'lodex_test_id.1',
            'lodex_test_id.2',
            'lodex_test_id2.1',
            'lodex_test_id.cancelled',
        ].forEach((file) => write(file));
        await removeUploadChunks(path.join(dir, 'lodex_test_id'));
        expect((await fs.promises.readdir(dir)).sort()).toEqual([
            'lodex_test_id.cancelled',
            'lodex_test_id2.1',
        ]);
    });

    it("removes the tenant's chunks and markers older than a day", async () => {
        const old = DAY_MS + 60_000;
        write('lodex_test_12-old.1', old);
        write('lodex_test_12-old.cancelled', old);
        write('lodex_test_12-old.queued', old);
        write('lodex_test_12-old.importing', old);
        write(
            'lodex_test_12-old.2.0b9a6c1e-4f3d-4c2a-9e8b-7d6f5a4b3c2d.tmp',
            old,
        );
        write('lodex_test_12-recent.1');
        write('other_12-old.1', old);
        // another tenant whose name starts with this one
        write('lodex_test_demo_12-old.1', old);
        write('lodex_test_12-old.csv', old);
        await removeStaleUploadFiles(dir, 'lodex_test');
        expect((await fs.promises.readdir(dir)).sort()).toEqual([
            'lodex_test_12-old.csv',
            'lodex_test_12-recent.1',
            'lodex_test_demo_12-old.1',
            'other_12-old.1',
        ]);
    });
});
