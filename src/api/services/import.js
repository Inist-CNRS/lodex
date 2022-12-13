import ezs from '@ezs/core';
import Script from './script';
import request from 'request';
import progress from './progress';
import { INDEXATION, SAVING_DATASET } from '../../common/progressStatus';

const loaders = new Script('loaders', '../app/custom/loaders');
const log = e => global.console.error('Error in pipeline.', e);

export const getLoader = async loaderName => {
    const currentLoader = await loaders.get(loaderName);
    if (!currentLoader) {
        throw new Error(`Unknown loader: ${loaderName}`);
    }

    const [, , , script] = currentLoader;

    // ezs is safe : errors do not break the pipeline
    return stream =>
        stream.pipe(ezs('delegate', { script })).pipe(ezs.catch(e => log(e)));
};

export const getStreamFromUrl = url => request.get(url);

export const startImport = async ctx => {
    if (progress.status !== SAVING_DATASET) {
        progress.start({
            status: SAVING_DATASET,
            subLabel: 'imported_lines',
            type: 'import',
        });
    }

    const { loaderName, url, filename, totalChunks, extension } =
        ctx.job?.data || {};
    const parseStream = await ctx.getLoader(
        !loaderName || loaderName === 'automatic' ? extension : loaderName,
    );
    let stream;
    if (url) {
        stream = ctx.getStreamFromUrl(url);
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
    progress.finish();

    if (filename && totalChunks) {
        await ctx.clearChunks(filename, totalChunks);
    }
};
