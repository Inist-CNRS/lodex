import ezs from '@ezs/core';
import ezsBasics from '@ezs/basics';
import {
    createFusible,
    enableFusible,
    disableFusible,
} from '@ezs/core/lib/fusible';
import breaker from '@ezs/core/lib/statements/breaker';
import fetch from 'fetch-with-proxy';
import progress from './progress';
import { INDEXATION, SAVING_DATASET } from '../../common/progressStatus';
import { Readable } from 'stream';
import localConfig from '../../../config.json';

ezs.use(ezsBasics);

export const getLoader = (loaderName, loaderEnvironment, loaderHeader) => (stream) => {
    const env2query = new URLSearchParams(loaderEnvironment);
    return stream
        .pipe(
            ezs('URLConnect', {
                url: `${
                    process.env.WORKERS_URL || 'http://localhost:31976'
                }/loaders/${loaderName}?${env2query}`,
                streaming: true,
                timeout: Number(localConfig.timeout) || 120000,
                json: false,
                encoder: 'transit',
                header: loaderHeader,
            }),
        )
        .pipe(ezs('unpack'));
};
export const getCustomLoader = async (script, loaderEnvironment) => {
    return (stream) =>
        stream.pipe(ezs('delegate', { script }, loaderEnvironment));
};

export const getStreamFromUrl = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.body;
};

export const getStreamFromText = (text) => {
    return Readable.from([text]);
};

export const startImport = async (ctx) => {
    const {
        loaderName,
        url,
        text,
        filename,
        totalChunks,
        extension,
        customLoader,
    } = ctx.job?.data || {};
    let fusible;
    try {
        if (progress.status !== SAVING_DATASET) {
            progress.start(ctx.tenant, {
                status: SAVING_DATASET,
                subLabel: 'imported_lines',
                type: 'import',
            });
        }
        const source = url ? url : filename;
        const parser =
            !loaderName || loaderName === 'automatic' ? extension : loaderName;

        fusible = await createFusible();
        await enableFusible(fusible);
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
            parseStream = await ctx.getCustomLoader(
                customLoader,
                loaderEnvironment,
            );
        } else {
            parseStream = ctx.getLoader(parser, loaderEnvironment, `'X-Request-ID:${fusible}`);
        }
        let stream;
        if (url) {
            stream = await ctx.getStreamFromUrl(url);
        }
        if (filename && totalChunks) {
            try {
                stream = ctx.mergeChunks(filename, totalChunks);
            } catch (error) {
                throw new Error(`Error while merging chunks: ${error}`);
            }
        }
        if (text) {
            loaderEnvironment.source = 'text input';
            stream = ctx.getStreamFromText(text);
        }
        const inputStream = stream.pipe(ezs(breaker, { fusible }));
        const parsedStream = await parseStream(inputStream);
        const outputStream = parsedStream.pipe(ezs(breaker, { fusible }));
        await ctx.saveParsedStream(ctx, outputStream);
        progress.start(ctx.tenant, {
            status: INDEXATION,
            type: 'import',
        });
        await ctx.dataset.indexColumns();
    } finally {
        await disableFusible(fusible);
        progress.finish(ctx.tenant);
        if (filename && totalChunks) {
            await ctx.clearChunks(filename, totalChunks);
        }
    }
};
