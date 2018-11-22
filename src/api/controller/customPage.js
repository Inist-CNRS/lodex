import path from 'path';

import { readFile } from '../services/fsHelpers';
import logger from '../services/logger';

const scriptRegEx = new RegExp('<script.*?( src=".*")?.*?>.*?</script>', 'gm');

export const getScriptsFromHtml = html =>
    (html.match(scriptRegEx) || [])
        .map(script => {
            const src = script.match(/<script.*?src="(.*?)".*?>/);
            return src && src[1];
        })
        .filter(src => !!src);

export default async ctx => {
    const { page: file } = ctx.request.query;
    if (!file) {
        ctx.status = 404;
        return;
    }

    let html;

    const pathname = path.resolve(
        __dirname,
        file.endsWith('/')
            ? `../../app/custom/${file}/index.html`
            : `../../app/custom/${file}`,
    );
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
