import path from 'path';

import { getFileStatsIfExists, readFile } from '../services/fsHelpers';
import logger from '../services/logger';

const scriptRegEx = new RegExp('<script.*?( src=".*")?.*?>.*?</script>', 'gm');

export const getScriptsFromHtml = html =>
    (html.match(scriptRegEx) || [])
        .map(script => {
            const src = script.match(/<script.*?src="(.*?)".*?>/);
            return src && src[1];
        })
        .filter(src => !!src);

const getPathname = async file => {
    const absoluteFilename = path.resolve(
        __dirname,
        `../../app/custom/${file}`,
    );

    const stats = await getFileStatsIfExists(absoluteFilename);

    if (stats && !stats.isDirectory()) {
        return absoluteFilename;
    }

    if (stats && stats.isDirectory()) {
        return `${absoluteFilename}/index.html`;
    }

    return `${absoluteFilename}.html`;
};

export default async ctx => {
    const { page: file } = ctx.request.query;
    if (!file) {
        ctx.status = 404;
        return;
    }

    const pathname = await getPathname(file);

    let html;

    try {
        html = (await readFile(pathname)).toString();
    } catch (error) {
        logger.error('Unable to read custom page file', {
            pathname,
            error,
        });
        ctx.status = 404;
        return;
    }

    const scripts = getScriptsFromHtml(html);

    ctx.body = { html, scripts };
};
