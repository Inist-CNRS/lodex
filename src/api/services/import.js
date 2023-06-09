import ezs from '@ezs/core';
import ezsBasics from '@ezs/basics';
import fetch from 'fetch-with-proxy';
import progress from './progress';
import { INDEXATION, SAVING_DATASET } from '../../common/progressStatus';

ezs.use(ezsBasics);

export const getLoader = (loaderName, loaderEnvironment) => stream =>
    stream.pipe(
        ezs(
            'URLConnect',
            {
                url: `${process.env.WORKERS_URL || 'http://localhost:31968'}/loaders/${loaderName}`,
                retries: 1,
                json: true,
                encoder: 'transit',
            },
            loaderEnvironment,
        ),
    );

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
            parseStream = ctx.getLoader(parser, loaderEnvironment);
        }
        let stream;
        if (url) {
            stream = await ctx.getStreamFromUrl(url);
        }
        if (filename && totalChunks) {
            stream = ctx.mergeChunks(filename, totalChunks);
        }
        const parsedStream = await parseStream(stream);
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
