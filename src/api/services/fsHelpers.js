import fs from 'fs';
import range from 'lodash.range';

import { concatStreams } from './streamHelper';

export const getFileStats = filename => new Promise((resolve, reject) => {
    fs.stat(filename, (error, result) => {
        if (error) {
            reject(error);
            return;
        }

        resolve(result);
    });
});

export const unlinkFile = filename => new Promise((resolve, reject) => {
    fs.unlink(filename, (error, result) => {
        if (error) {
            reject(error);
            return;
        }

        resolve(result);
    });
});

export const getFileSize = async (filename) => {
    try {
        const { size } = await getFileStats(filename);
        return size;
    } catch (error) {
        return 0;
    }
};

export const checkFileExists = async (filename, size) =>
    (await getFileSize(filename)) === size;

export const saveStreamInFile = (stream, filename) =>
    new Promise((resolve, reject) => {
        const writableStream = fs.createWriteStream(filename);

        stream.pipe(writableStream);

        stream.on('end', resolve);
        stream.on('error', reject);
    });

export const mergeChunks = async (filename, nbChunks) => {
    const stream = fs.createWriteStream(filename);
    const sourceStreams = range(1, nbChunks + 1)
        .map(nb => `${filename}.${nb}`)
        .map(chunkname => fs.createReadStream(chunkname));

    await concatStreams(sourceStreams, stream);
};

export const areFileChunksComplete = async (filename, totalChunk, totalSize) => {
    const loop = async (chunkNumber, curSize = 0) => {
        if (chunkNumber === 0) {
            return totalSize === curSize;
        }
        const chunkname = `${filename}.${chunkNumber}`;
        const chunkSize = await getFileSize(chunkname);
        if (chunkSize === 0) {
            return false;
        }

        return loop(chunkNumber - 1, curSize + chunkSize);
    };

    return loop(totalChunk);
};

export const clearChunks = async (filename, nbChunks) =>
    Promise.all(
        range(1, nbChunks + 1).map(nb => unlinkFile(`${filename}.${nb}`)),
    );
