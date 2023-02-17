import ezs from '@ezs/core';
import fs from 'fs';
import Script from './script';
import fetch from 'fetch-with-proxy';
import progress from './progress';
import { INDEXATION, SAVING_DATASET } from '../../common/progressStatus';
import safePipe from './safePipe';

const loaders = new Script('loaders', '../app/custom/loaders');

export const getLoader = async (loaderName, loaderEnvironment) => {
    const currentLoader = await loaders.get(loaderName);
    if (!currentLoader) {
        throw new Error(`Unknown loader: ${loaderName}`);
    }

    const [, , , script] = currentLoader;

    // ezs is safe : errors do not break the pipeline
    return stream =>
        stream.pipe(ezs('delegate', { script }, loaderEnvironment));
};

export const getCustomLoader = async (script, loaderEnvironment) => {
    return stream =>
        stream.pipe(ezs('delegate', { script }, loaderEnvironment));
};

export const getStreamFromUrl = async url => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.body;
};

export const startImport = async ctx => {
    const { loaderName, url, filename, totalChunks, extension, customLoader } =
        ctx.job?.data || {};
    try {
        if (progress.status !== SAVING_DATASET) {
            progress.start({
                status: SAVING_DATASET,
                subLabel: 'imported_lines',
                type: 'import',
            });
        }
        const source = url ? url : filename;
        const parser =
            !loaderName || loaderName === 'automatic' ? extension : loaderName;
        const loaderEnvironment = {
            source,
            parser,
        };
        let parseStream;
        if (customLoader) {
            loaderEnvironment.parser = loaderEnvironment.parser.concat(
                '/custom',
            );
            parseStream = await ctx.getCustomLoader(
                customLoader,
                loaderEnvironment,
            );
        } else {
            parseStream = await ctx.getLoader(parser, loaderEnvironment);
        }
        let stream;
        if (url) {
            stream = await ctx.getStreamFromUrl(url);
        }
        if (filename && totalChunks) {
            stream = ctx.mergeChunks(filename, totalChunks);
        }

        // save incoming stream to a file to check if it contains invalid characters
        safePipe(stream, [fs.createWriteStream('upload/test.csv')]);

        const parsedStream = await parseStream(stream);

        parsedStream.on('data', data => {
            if (
                data['Data Annotations Nom'].includes('�') ||
                data['Data Annotations Termes Génériques'].includes('�')
            ) {
                console.log('####### PARSED DATA #######');
                console.log(data);
                console.log('###########################');
            }
        });
        await ctx.saveParsedStream(ctx, parsedStream);
        progress.start({
            status: INDEXATION,
            type: 'import',
        });
        await ctx.dataset.indexColumns();
    } finally {
        progress.finish();
        if (filename && totalChunks) {
            await ctx.clearChunks(filename, totalChunks);
        }
    }
};
