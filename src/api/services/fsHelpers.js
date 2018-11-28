import fs from 'fs';
import range from 'lodash.range';
import rangeRight from 'lodash.rangeright';
import multiStream from 'multistream';

import composeAsync from '../../common/lib/composeAsync';
import safePipe from './safePipe';

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
    new Promise((resolve, reject) =>
        safePipe(stream, [fs.createWriteStream(filename)])
            .on('error', reject)
            .on('finish', resolve),
    );
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

export const addFileSize = chunkFilename => async (totalSize = 0) => {
    const size = await getFileSize(chunkFilename);

    return size + totalSize;
};

export const getUploadedFileSizeFactory = addFileSizeImpl => async (
    filename,
    totalChunk,
) => {
    const sizeComputation = rangeRight(1, totalChunk + 1)
        .map(nb => `${filename}.${nb}`)
        .map(name => addFileSizeImpl(name));

    return composeAsync(...sizeComputation)();
};

export const getUploadedFileSize = getUploadedFileSizeFactory(addFileSize);

export const clearChunksFactory = unlinkFileImpl => async (
    filename,
    nbChunks,
) =>
    Promise.all(
        range(1, nbChunks + 1).map(nb => unlinkFileImpl(`${filename}.${nb}`)),
    );

export const clearChunks = clearChunksFactory(unlinkFile);

export const readFile = file =>
    new Promise((resolve, reject) => {
        fs.readFile(file, (error, content) =>
            error ? reject(error) : resolve(content),
        );
    });

export const getFileStatsIfExists = pathname =>
    new Promise((resolve, reject) => {
        fs.access(pathname, fs.constants.R_OK, err => {
            if (err) {
                resolve(false);
                return;
            }

            getFileStats(pathname)
                .then(resolve)
                .catch(reject);
        });
    });
