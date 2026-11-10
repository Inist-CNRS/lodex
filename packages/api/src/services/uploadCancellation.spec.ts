import fs from 'fs';
import os from 'os';
import path from 'path';
import {
    isUploadCancelled,
    markUploadCancelled,
    removeStaleUploadFiles,
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
        write('lodex_test_old.1', DAY_MS + 60_000);
        write('lodex_test_old.cancelled', DAY_MS + 60_000);
        write('lodex_test_recent.1');
        write('other_old.1', DAY_MS + 60_000);
        write('lodex_test_old.csv', DAY_MS + 60_000);
        await removeStaleUploadFiles(dir, 'lodex_test');
        expect((await fs.promises.readdir(dir)).sort()).toEqual([
            'lodex_test_old.csv',
            'lodex_test_recent.1',
            'other_old.1',
        ]);
    });
});
