import {
    clearChunksFactory,
    getUploadedFileSizeFactory,
    mergeChunksFactory,
    addFileSize
} from './fsHelpers';

describe('fsHelpers', () => {
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
                )('filename', 3, 3);
                expect(result).toBe(3);
            });

            it('should call addFileSizeImpl with each (chunkname)(size)', async () => {
                await getUploadedFileSizeFactory(addFileSizeImpl)(
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
            const reallyAddFileSize = jest.fn(() => 0); // as if file had a size of 1

            const addFileSizeImpl = jest
                .fn()
                .mockImplementation(() => reallyAddFileSize);

            it('should return 0 when addFileSize return 0', async () => {
                const result = await getUploadedFileSizeFactory(
                    addFileSizeImpl,
                )('filename', 3, 3);
                expect(result).toBe(0);
            });

            it('should call addFileSizeImpl with (chunkname)(size)', async () => {
                await getUploadedFileSizeFactory(addFileSizeImpl)(
                    'filename',
                    3,
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
                )('filename', 3, 3).catch(({ message }) => message);
                expect(errorMessage).toBe('Boom');
            });
        });
    });

    describe('mergeChunksFactory', () => {
        const createReadStreamImpl = jest.fn(v => `read stream for ${v}`);
        const multiStreamImpl = jest.fn(() => 'merged stream');
        beforeAll(async () => {
            await mergeChunksFactory(createReadStreamImpl, multiStreamImpl)(
                'filename',
                3,
            );
        });

        it('should have called createReadStreamImpl with each generated chunkname', () => {
            expect(createReadStreamImpl).toHaveBeenCalledWith('filename.1');
            expect(createReadStreamImpl).toHaveBeenCalledWith('filename.2');
            expect(createReadStreamImpl).toHaveBeenCalledWith('filename.3');
        });

        it('should have called multiStreamImpl with created array of readStream and write stream', () => {
            expect(multiStreamImpl).toHaveBeenCalledWith([
                'read stream for filename.1',
                'read stream for filename.2',
                'read stream for filename.3',
            ]);
        });
    });
});
