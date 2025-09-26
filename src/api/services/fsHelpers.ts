import fs from 'fs';
// @ts-expect-error TS(2792): Cannot find module 'lodash/range'. Did you mean to... Remove this comment to see the full error message
import range from 'lodash/range';
// @ts-expect-error TS(2792): Cannot find module 'lodash/rangeRight'. Did you me... Remove this comment to see the full error message
import rangeRight from 'lodash/rangeRight';
// @ts-expect-error TS(2792): Cannot find module 'multistream'. Did you mean to ... Remove this comment to see the full error message
import MultiStream from 'multistream';

// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import composeAsync from '../../common/lib/composeAsync';
import safePipe from './safePipe';

export const unlinkFile = (filename: any) =>
    new Promise((resolve: any, reject: any) => {
        fs.unlink(filename, (error: any) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });

export const saveStreamInFile = (stream: any, filename: any) =>
    new Promise((resolve: any, reject: any) =>
        safePipe(stream, [fs.createWriteStream(filename)])
            .on('error', reject)
            .on('finish', resolve),
    );
export const createWriteStream = (chunkname: any) =>
    fs.createWriteStream(chunkname);

export const createReadStream = (chunkname: any) =>
    fs.createReadStream(chunkname);

export const mergeChunksFactory =
    (createReadStreamImpl: any) => (filename: any, nbChunks: any) => {
        const sourceStreams = range(1, nbChunks + 1)
            .map((nb: any) => `${filename}.${nb}`)
            .map((chunkname: any) => createReadStreamImpl(chunkname));

        return new MultiStream(sourceStreams);
    };

export const mergeChunks = mergeChunksFactory(createReadStream);

export const getFileStats = (filename: any) =>
    new Promise((resolve: any, reject: any) => {
        fs.stat(filename, (error: any, result: any) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        });
    });

export const getFileSize = (filename: any) =>
    composeAsync(
        getFileStats,
        ({ size }: any) => size,
    )(filename).catch(() => 0);

export const checkFileExists = (filename: any, expectedSize: any) =>
    composeAsync(getFileSize, (size: any) => size === expectedSize)(filename);

export const addFileSize =
    (chunkFilename: any) =>
    async (totalSize = 0) => {
        const size = await getFileSize(chunkFilename);

        return size + totalSize;
    };

export const getUploadedFileSizeFactory =
    (addFileSizeImpl: any) => async (filename: any, totalChunk: any) => {
        const sizeComputation = rangeRight(1, totalChunk + 1)
            .map((nb: any) => `${filename}.${nb}`)
            .map((name: any) => addFileSizeImpl(name));

        return composeAsync(...sizeComputation)();
    };

export const getUploadedFileSize = getUploadedFileSizeFactory(addFileSize);

export const clearChunksFactory =
    (unlinkFileImpl: any) => async (filename: any, nbChunks: any) =>
        Promise.all(
            range(1, nbChunks + 1).map((nb: any) =>
                unlinkFileImpl(`${filename}.${nb}`),
            ),
        );

export const clearChunks = clearChunksFactory(unlinkFile);

export const readFile = (file: any) =>
    new Promise((resolve: any, reject: any) => {
        fs.readFile(file, (error: any, content: any) =>
            error ? reject(error) : resolve(content),
        );
    });

export const getFileStatsIfExists = (pathname: any) =>
    new Promise((resolve: any, reject: any) => {
        fs.access(pathname, fs.constants.R_OK, (err: any) => {
            if (err) {
                resolve(false);
                return;
            }

            getFileStats(pathname).then(resolve).catch(reject);
        });
    });
