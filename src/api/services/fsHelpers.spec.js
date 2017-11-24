import expect, { createSpy } from 'expect';

import {
    clearChunksFactory,
    areFileChunksCompleteFactory,
    mergeChunksFactory,
} from './fsHelpers';

describe('fsHelpers', () => {
    describe('clearChunksFactory', () => {
        it('should call unlinkFile with each chunk', async () => {
            const unlinkFile = createSpy();

            await clearChunksFactory(unlinkFile)('filename', 3);

            expect(unlinkFile).toHaveBeenCalledWith('filename.1');
            expect(unlinkFile).toHaveBeenCalledWith('filename.2');
            expect(unlinkFile).toHaveBeenCalledWith('filename.3');
        });
    });

    describe('areFileChunksCompleteFactory', () => {
        describe('no error', () => {
            const reallyAddFileSize = createSpy(
                (size = 0) => size + 1,
            ).andCallThrough(); // as if file had a size of 1
            const addFileSizeImpl = createSpy().andReturn(reallyAddFileSize);

            it('should return true if resulting size is equal to total size', async () => {
                const result = await areFileChunksCompleteFactory(
                    addFileSizeImpl,
                )('filename', 3, 3);
                expect(result).toBe(true);
            });

            it('should return false if resulting size is less than total size', async () => {
                const result = await areFileChunksCompleteFactory(
                    addFileSizeImpl,
                )('filename', 3, 2);
                expect(result).toBe(false);
            });

            it('should call addFileSizeImpl with each (chunkname)(size)', async () => {
                await areFileChunksCompleteFactory(addFileSizeImpl)(
                    'filename',
                    3,
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
            const reallyAddFileSize = createSpy((size = 0) => {
                if (size === 1) {
                    throw new Error('empty chunk');
                }
                return size + 1;
            }).andCallThrough(); // as if file had a size of 1

            const addFileSizeImpl = createSpy().andReturn(reallyAddFileSize);

            it('should return false when addFileSize throw empty chunk error', async () => {
                const result = await areFileChunksCompleteFactory(
                    addFileSizeImpl,
                )('filename', 3, 3);
                expect(result).toBe(false);
            });

            it('should call addFileSizeImpl with (chunkname)(size) up to error', async () => {
                await areFileChunksCompleteFactory(addFileSizeImpl)(
                    'filename',
                    3,
                    3,
                );

                expect(addFileSizeImpl).toHaveBeenCalledWith('filename.1');
                expect(addFileSizeImpl).toHaveBeenCalledWith('filename.2');
                expect(addFileSizeImpl).toHaveBeenCalledWith('filename.3');

                expect(reallyAddFileSize).toHaveBeenCalledWith(undefined);
                expect(reallyAddFileSize).toHaveBeenCalledWith(1);

                let error;
                try {
                    expect(reallyAddFileSize).toHaveBeenCalledWith(2);
                } catch (e) {
                    error = e.message;
                }

                expect(error).toBe('spy was never called with [ 2 ]');
            });
        });

        describe('with other error', () => {
            const reallyAddFileSize = createSpy((size = 0) => {
                if (size === 1) {
                    throw new Error('Boom');
                }
                return size + 1;
            }).andCallThrough(); // as if file had a size of 1

            const addFileSizeImpl = createSpy().andReturn(reallyAddFileSize);

            it('should return throw other error', async () => {
                const errorMessage = await areFileChunksCompleteFactory(
                    addFileSizeImpl,
                )('filename', 3, 3).catch(({ message }) => message);
                expect(errorMessage).toBe('Boom');
            });
        });
    });

    describe('mergeChunksFactory', () => {
        const createWriteStreamImpl = createSpy(
            v => `write stream for ${v}`,
        ).andCallThrough();
        const createReadStreamImpl = createSpy(
            v => `read stream for ${v}`,
        ).andCallThrough();
        const concatStreamsImpl = createSpy();
        before(async () => {
            await mergeChunksFactory(
                createWriteStreamImpl,
                createReadStreamImpl,
                concatStreamsImpl,
            )('filename', 3);
        });

        it('should have called createWriteStreamImpl with filename', () => {
            expect(createWriteStreamImpl).toHaveBeenCalledWith('filename');
        });

        it('should have called createReadStreamImpl with each generated chunkname', () => {
            expect(createReadStreamImpl).toHaveBeenCalledWith('filename.1');
            expect(createReadStreamImpl).toHaveBeenCalledWith('filename.2');
            expect(createReadStreamImpl).toHaveBeenCalledWith('filename.3');
        });

        it('should have called concatStreamImpl with created array of readStream and write stream', () => {
            expect(concatStreamsImpl).toHaveBeenCalledWith(
                [
                    'read stream for filename.1',
                    'read stream for filename.2',
                    'read stream for filename.3',
                ],
                'write stream for filename',
            );
        });
    });
});
