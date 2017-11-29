import fs from 'fs';
import range from 'lodash.range';
import rangeRight from 'lodash.rangeright';
import multiStream from 'multistream';

import composeAsync from '../../common/lib/composeAsync';

export const unlinkFile = filename =>
    new Promise((resolve, reject) => {
        fs.unlink(filename, (error, result) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        });
    });

export const saveStreamInFile = (stream, filename) =>
    new Promise((resolve, reject) => {
        const writableStream = fs.createWriteStream(filename);

        stream.pipe(writableStream);

        stream.on('end', resolve);
        stream.on('error', reject);
    });

export const createWriteStream = chunkname => fs.createWriteStream(chunkname);

export const createReadStream = chunkname => fs.createReadStream(chunkname);

export const mergeChunksFactory = (createReadStreamImpl, multiStreamImpl) => (
    filename,
    nbChunks,
) => {
    const sourceStreams = range(1, nbChunks + 1)
        .map(nb => `${filename}.${nb}`)
        .map(chunkname => createReadStreamImpl(chunkname));

    return multiStreamImpl(sourceStreams);
};

export const mergeChunks = mergeChunksFactory(createReadStream, multiStream);

export const getFileStats = filename =>
    new Promise((resolve, reject) => {
        fs.stat(filename, (error, result) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        });
    });

export const getFileSize = filename =>
    composeAsync(getFileStats, ({ size }) => size)(filename).catch(() => 0);

export const checkFileExists = (filename, expectedSize) =>
    composeAsync(getFileSize, size => size === expectedSize)(filename);

const addFileSize = chunkFilename => async (totalSize = 0) => {
    const size = await getFileSize(chunkFilename);

    if (size === 0) {
        throw new Error('empty chunk');
    }

    return size + totalSize;
};

export const areFileChunksCompleteFactory = addFileSizeImpl => async (
    filename,
    totalChunk,
    totalSize,
) => {
    const sizeComputation = rangeRight(1, totalChunk + 1)
        .map(nb => `${filename}.${nb}`)
        .map(name => addFileSizeImpl(name));

    try {
        const size = await composeAsync(...sizeComputation)();

        return size === totalSize;
    } catch (error) {
        if (error.message === 'empty chunk') {
            return false;
        }

        throw error;
    }
};

export const areFileChunksComplete = areFileChunksCompleteFactory(addFileSize);

export const clearChunksFactory = unlinkFileImpl => async (
    filename,
    nbChunks,
) =>
    Promise.all(
        range(1, nbChunks + 1).map(nb => unlinkFileImpl(`${filename}.${nb}`)),
    );

export const clearChunks = clearChunksFactory(unlinkFile);
