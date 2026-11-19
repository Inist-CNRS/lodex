// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
import {
    createFusible,
    enableFusible,
    disableFusible,
    checkFusible,
} from '@ezs/core/fusible';
// @ts-expect-error TS(2792): Cannot find module 'fetch-with-proxy'. Did you mea... Remove this comment to see the full error message
import fetch from 'fetch-with-proxy';
import progress from './progress';
import { ProgressStatus } from '@lodex/common';
import { Readable } from 'stream';
import config from 'config';
import getLogger from './logger';
import {
    isUploadCancelled,
    removeUploadChunks,
    removeUploadQueuedMarker,
} from './uploadCancellation';

export const getLoader =
    (loaderName: any, loaderEnvironment: any, loaderHeader: any) =>
    (stream: any) => {
        const env2query = new URLSearchParams(loaderEnvironment);
        return stream
            .pipe(
                ezs('URLConnect', {
                    url: `${config.get('ezs.url')}/loaders/${loaderName}?${env2query}`,
                    streaming: config.get('streaming'),
                    timeout: config.get('timeout'),
                    json: false,
                    encoder: 'transit',
                    header: loaderHeader,
                }),
            )
            .pipe(ezs('unpack'));
    };
export const getCustomLoader = (script: any, loaderEnvironment: any) => {
    return (stream: any) =>
        stream.pipe(ezs('delegate', { script }, loaderEnvironment));
};

// enough to explain an error, without waiting for or keeping a whole page
const MAX_ERROR_ANSWER_LENGTH = 10_000;
const ERROR_ANSWER_TIMEOUT = 5_000;

// the start of the answer of a failed url: a stalled or cut off answer must
// not hide the status
const readErrorAnswer = async (body: NodeJS.ReadableStream & any) => {
    let answer = '';
    const timeout = setTimeout(() => body.destroy(), ERROR_ANSWER_TIMEOUT);
    try {
        for await (const chunk of body) {
            answer += chunk;
            if (answer.length >= MAX_ERROR_ANSWER_LENGTH) {
                break;
            }
        }
    } catch {
        // cut off or stalled: keep what came
    } finally {
        clearTimeout(timeout);
        body.destroy();
    }
    return answer.slice(0, MAX_ERROR_ANSWER_LENGTH);
};

export const getStreamFromUrl = async (url: any) => {
    const response = await fetch(url);
    if (!response.ok) {
        // the status and the answer explain the error to the user
        throw Object.assign(new Error(response.statusText), {
            status: response.status,
            responseText: await readErrorAnswer(response.body),
        });
    }
    return response.body;
};

export const getStreamFromText = (text: any) => {
    return Readable.from([text]);
};

// What a queued import that does not run leaves: the chunks of its upload,
// and the progress of the upload
export const discardQueuedImport = async (ctx: any) => {
    const { filename, totalChunks } = ctx.job?.data || {};
    if (filename && totalChunks) {
        await removeUploadChunks(filename);
        await removeUploadQueuedMarker(filename);
    }
    // the progress still shows the end of the upload
    if (progress.getStatus(ctx.tenant) === ProgressStatus.UPLOADING_DATASET) {
        progress.finish(ctx.tenant);
    }
};

// givenFusible: the one the worker created and enabled, which a cancel
// disables (see cancelImportJob): it must not be enabled again
export const startImport = async (ctx: any, givenFusible?: string) => {
    const {
        loaderName,
        url,
        text,
        filename,
        totalChunks,
        extension,
        customLoader,
    } = ctx.job?.data || {};
    // the upload was cancelled after its import was queued: reported as a
    // cancel, without touching the dataset
    if (filename && totalChunks && (await isUploadCancelled(filename))) {
        await discardQueuedImport(ctx);
        throw new Error('cancelled_import');
    }
    const fusible = givenFusible ?? (await createFusible());
    try {
        // @ts-expect-error TS(2339): Property 'status' does not exist on type 'Progress... Remove this comment to see the full error message
        if (progress.status !== ProgressStatus.SAVING_DATASET) {
            progress.start(ctx.tenant, {
                status: ProgressStatus.SAVING_DATASET,
                subLabel: 'imported_lines',
                type: 'import',
            });
        }
        const source = url ? url : filename;
        const parser =
            !loaderName || loaderName === 'automatic' ? extension : loaderName;

        if (!givenFusible) {
            await enableFusible(fusible);
        }
        ctx.job.update({
            ...ctx.job.data,
            fusible,
        });
        const loaderEnvironment = {
            source,
            parser,
            fusible,
        };
        let parseStream;
        if (customLoader) {
            loaderEnvironment.parser =
                loaderEnvironment.parser.concat('/custom');
            parseStream = ctx.getCustomLoader(customLoader, loaderEnvironment);
        } else {
            parseStream = ctx.getLoader(
                parser,
                loaderEnvironment,
                `'X-Request-ID:${fusible}`,
            );
        }
        let stream;
        if (url) {
            stream = await ctx.getStreamFromUrl(url);
        }
        if (filename && totalChunks) {
            stream = ctx.mergeChunks(filename, totalChunks);
        }
        if (text) {
            loaderEnvironment.source = 'text input';
            stream = ctx.getStreamFromText(text);
        }
        const inputStream = stream.pipe(ezs('breaker', { fusible }));
        const parsedStream = parseStream(inputStream);
        // a loader can read data of another format without failing: it then
        // reads no line, and the import must fail
        let readLines = 0;
        const outputStream = parsedStream
            .pipe(ezs('assign', { path: '_lodexPublished', value: false }))
            .pipe(
                ezs(function countLine(this: any, data: any, feed: any) {
                    if (this.isLast()) {
                        return feed.close();
                    }
                    readLines += 1;
                    return feed.send(data);
                }),
            )
            .pipe(ezs('breaker', { fusible }));

        await ctx.saveParsedStream(ctx, outputStream);
        // a cancel (cancelJob, stopJobs) cuts the stream without an error:
        // its import is failed already, not for a lack of lines
        if (readLines === 0 && (await checkFusible(fusible))) {
            throw Object.assign(new Error('The loader read no line'), {
                code: 'import_error_no_line',
            });
        }
        progress.start(ctx.tenant, {
            status: ProgressStatus.INDEXATION,
            type: 'import',
        });
        await ctx.dataset.indexColumns();
    } catch (error) {
        const logger = getLogger(ctx.tenant);
        logger.error('Error during import', error);
        // the cause tells the user what went wrong (see importError)
        throw new Error(`Error during import: ${error}`, { cause: error });
    } finally {
        await disableFusible(fusible);
        progress.finish(ctx.tenant);
        if (filename && totalChunks) {
            await ctx.clearChunks(filename, totalChunks);
            await removeUploadQueuedMarker(filename);
        }
    }
};
