import path from 'path';

import {
    getFileStatsIfExists,
    getRealPath,
    readFile,
} from '../services/fsHelpers';
import getLogger from '../services/logger';

const scriptRegEx = new RegExp('<script.*?( src=".*")?.*?>.*?</script>', 'gim');

// @ts-expect-error TS7006
export const getScriptsFromHtml = (html) =>
    (html.match(scriptRegEx) || [])
        // @ts-expect-error TS7006
        .map((script) => {
            const src = script.match(/<script.*?src="(.*?)".*?>/);
            return src && src[1];
        })
        // @ts-expect-error TS7006
        .filter((src) => !!src);

// @ts-expect-error TS7006
export const getPathname = async (file, tenant) => {
    const rootDir = path.resolve(
        __dirname,
        `../../../../src/app/custom/instance/${tenant}`,
    );
    const absoluteFilename = path.resolve(rootDir, file);

    const resolvedPath = getRealPath(absoluteFilename);
    const resolvedRoot = getRealPath(rootDir);

    if (!resolvedPath.startsWith(resolvedRoot)) {
        return null;
    }

    const stats = await getFileStatsIfExists(absoluteFilename);

    // @ts-expect-error TS2339
    if (stats && !stats.isDirectory()) {
        return absoluteFilename;
    }

    // @ts-expect-error TS2339
    if (stats && stats.isDirectory()) {
        return `${absoluteFilename}/index.html`;
    }

    return `${absoluteFilename}.html`;
};

// @ts-expect-error TS7006
export default async (ctx) => {
    const { page: file } = ctx.request.query;
    const tenant = ctx.tenant;
    if (!file) {
        ctx.status = 404;
        return;
    }

    const pathname = await getPathname(file, tenant);

    if (!pathname) {
        ctx.status = 404;
        return;
    }

    let html;

    try {
        // @ts-expect-error TS2571
        html = (await readFile(pathname)).toString();
    } catch (error) {
        const logger = getLogger(ctx.tenant);
        logger.error(`Unable to read custom page file`, {
            pathname,
            error,
        });
        ctx.status = 404;
        return;
    }

    const scripts = getScriptsFromHtml(html);

    ctx.body = { html, scripts };
};
