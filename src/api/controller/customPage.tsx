import path from 'path';

import { getFileStatsIfExists, readFile } from '../services/fsHelpers';
import getLogger from '../services/logger';

const scriptRegEx = new RegExp('<script.*?( src=".*")?.*?>.*?</script>', 'gm');

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
const getPathname = async (file, tenant) => {
    const absoluteFilename = path.resolve(
        __dirname,
        `../../app/custom/instance/${tenant}/${file}`,
    );

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
