import fs from 'fs';
import os from 'os';
import path from 'path';
import { Readable } from 'stream';

import {
    clearChunksFactory,
    getUploadedFileSizeFactory,
    saveStreamInFile,
} from './fsHelpers';

describe('fsHelpers', () => {
    describe('saveStreamInFile', () => {
        let dir: string;
        beforeEach(() => {
            dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lodex-chunk-'));
        });
        afterEach(() => {
            fs.rmSync(dir, { recursive: true, force: true });
        });

        it('should keep the previous chunk complete while it is being rewritten', async () => {
            const chunkname = path.join(dir, 'upload.1');
            fs.writeFileSync(chunkname, 'complete content');

            const slowStream = new Readable({
                read() {},
            });
            const saving = saveStreamInFile(slowStream, chunkname);
            slowStream.push('complete');
            await new Promise((resolve) => setTimeout(resolve, 50));
            const sizeDuringWrite = fs.statSync(chunkname).size;
            slowStream.push(' content');
            slowStream.push(null);
            await saving;

            expect(sizeDuringWrite).toBe('complete content'.length);
            expect(fs.readFileSync(chunkname, 'utf8')).toBe('complete content');
            expect(fs.readdirSync(dir)).toEqual(['upload.1']);
        });

        it('should not leave any file when the stream fails', async () => {
            const chunkname = path.join(dir, 'upload.1');
            const failingStream = new Readable({
                read() {
                    this.destroy(new Error('boom'));
                },
            });

            await expect(
                saveStreamInFile(failingStream, chunkname),
            ).rejects.toThrow('boom');
            expect(fs.readdirSync(dir)).toEqual([]);
        });
    });

    describe('clearChunksFactory', () => {
        it('should call unlinkFile with each chunk', async () => {
            const unlinkFile = jest.fn();

            await clearChunksFactory(unlinkFile)('filename', 3);

            expect(unlinkFile).toHaveBeenCalledWith('filename.1');
            expect(unlinkFile).toHaveBeenCalledWith('filename.2');
            expect(unlinkFile).toHaveBeenCalledWith('filename.3');
        });
    });

    describe('getUploadedFileSizeFactory', () => {
        describe('no error', () => {
            const reallyAddFileSize = jest.fn((size = 0) => size + 1); // as if file had a size of 1
            const addFileSizeImpl = jest
                .fn()
                .mockImplementation(() => reallyAddFileSize);

            it('should return the resulting size', async () => {
                const result = await getUploadedFileSizeFactory(
                    addFileSizeImpl,
                    // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
                )('filename', 3, 3);
                expect(result).toBe(3);
            });

            it('should call addFileSizeImpl with each (chunkname)(size)', async () => {
                await getUploadedFileSizeFactory(addFileSizeImpl)(
                    'filename',
                    3,
                    // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
                    3,
                );

                expect(addFileSizeImpl).toHaveBeenCalledWith('filename.1');
                expect(addFileSizeImpl).toHaveBeenCalledWith('filename.2');
                expect(addFileSizeImpl).toHaveBeenCalledWith('filename.3');

                expect(reallyAddFileSize).toHaveBeenCalledWith(undefined);
                expect(reallyAddFileSize).toHaveBeenCalledWith(1);
                expect(reallyAddFileSize).toHaveBeenCalledWith(2);
            });
        });

        describe('with empty chunk error', () => {
            const reallyAddFileSize = jest.fn(() => 0); // as if file had a size of 1

            const addFileSizeImpl = jest
                .fn()
                .mockImplementation(() => reallyAddFileSize);

            it('should return 0 when addFileSize return 0', async () => {
                const result = await getUploadedFileSizeFactory(
                    addFileSizeImpl,
                    // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
                )('filename', 3, 3);
                expect(result).toBe(0);
            });

            it('should call addFileSizeImpl with (chunkname)(size)', async () => {
                await getUploadedFileSizeFactory(addFileSizeImpl)(
                    'filename',
                    3,
                    // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
                    3,
                );

                expect(addFileSizeImpl).toHaveBeenCalledWith('filename.1');
                expect(addFileSizeImpl).toHaveBeenCalledWith('filename.2');
                expect(addFileSizeImpl).toHaveBeenCalledWith('filename.3');

                expect(reallyAddFileSize).toHaveBeenCalledWith(undefined);
                expect(reallyAddFileSize).toHaveBeenCalledWith(0);
                expect(reallyAddFileSize).toHaveBeenCalledWith(0);
            });
        });

        describe('with other error', () => {
            const reallyAddFileSize = jest.fn((size = 0) => {
                if (size === 1) {
                    throw new Error('Boom');
                }
                return size + 1;
            }); // as if file had a size of 1

            const addFileSizeImpl = jest
                .fn()
                .mockImplementation(() => reallyAddFileSize);

            it('should return throw other error', async () => {
                const errorMessage = await getUploadedFileSizeFactory(
                    addFileSizeImpl,
                    // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
                )('filename', 3, 3).catch(({ message }: any) => message);
                expect(errorMessage).toBe('Boom');
            });
        });
    });
});
