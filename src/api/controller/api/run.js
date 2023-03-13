import Koa from 'koa';
import route from 'koa-route';
import ezs from '@ezs/core';
import Booster from '@ezs/booster';
import Storage from '@ezs/storage';
import Lodex from '@ezs/lodex';
import { PassThrough } from 'stream';
import cacheControl from 'koa-cache-control';
import config from 'config';
import fetch from 'fetch-with-proxy';
import URL from 'url';
import qs from 'qs';

import Script from '../../services/script';
import localConfig from '../../../../config.json';
import { getCleanHost } from '../../../common/uris';
import { mongoConnectionString } from '../../services/mongoClient';

ezs.use(Lodex);
ezs.use(Booster);
ezs.use(Storage);

const scripts = new Script('routines', '../app/custom/routines');

const parseFieldsParams = fieldsParams =>
    typeof fieldsParams === 'string' && fieldsParams !== ''
        ? fieldsParams.split('/').filter(x => x)
        : '';

const middlewareScript = async (ctx, scriptNameCalledParam, fieldsParams) => {
    const currentScript = await scripts.get(scriptNameCalledParam);
    if (!currentScript) {
        ctx.throw(404, `Unknown script '${scriptNameCalledParam}'.ini`);
    }

    try {
        const [, metaData, , script] = currentScript;
        ctx.type = metaData.mimeType;
        ctx.status = 200;
        if (metaData.fileName) {
            const attachmentOpts = {
                fallback: false,
                type: metaData.type === 'file' ? 'attachment' : 'inline',
            };
            ctx.attachment(metaData.fileName, attachmentOpts);
        }
        // Legacy
        const orderBy = [
            ctx.query.sortBy || '_id',
            String(ctx.query.sortDir || 'asc').toLowerCase(),
        ].join('/');

        const field = parseFieldsParams(fieldsParams);
        const environment = {
            ...localConfig,
            ...ctx.query, // like lodex-extended server
            field,
        };
        const host = getCleanHost();
        const query = {
            orderBy,
            field,
            ...ctx.query, //usefull ?
            connectionStringURI: mongoConnectionString,
            host,
        };
        const input = new PassThrough({ objectMode: true });
        const commands = ezs.parseString(script, environment);
        const errorHandle = err => {
            ctx.status = 503;
            ctx.body.destroy();
            input.destroy();
            global.console.error(
                'Error with ',
                ctx.path,
                ' and',
                ctx.query,
                err,
            );
        };
        const emptyHandle = () => {
            if (ctx.headerSent === false) {
                ctx.body.write('{"total":0}');
                global.console.error(
                    'Empty response with ',
                    ctx.path,
                    ' and',
                    ctx.query,
                );
            }
        };
        if (localConfig.pluginsAPI) {
            const wurl = URL.parse(localConfig.pluginsAPI);
            wurl.pathname = `/routines/${scriptNameCalledParam}.ini`;
            wurl.search = qs.stringify(query, { indices: false });
            const href = URL.format(wurl);
            // Warning : Don't use proxy with docker virtual network
            process.env.no_proxy = String(process.env.no_proxy || 'localhost')
                .split(',')
                .concat(wurl.hostname)
                .filter((value, index, self) => self.indexOf(value) === index)
                .join(',');
            const response = await fetch(href);
            ctx.body = response.body
                .on('finish', emptyHandle)
                .on('error', errorHandle);
        } else {
            const statement = scripts.useCache() ? 'boost' : 'delegate';
            ctx.body = input
                .pipe(ezs(statement, { commands }, environment))
                .pipe(ezs.catch())
                .on('finish', emptyHandle)
                .on('error', errorHandle)
                .pipe(ezs.toBuffer());
        }
        input.write(query);
        input.end();
    } catch (err) {
        console.error(err);
        ctx.throw(500, err);
    }
};

export async function getScripts(ctx) {
    ctx.body = await scripts.list();
}

const app = new Koa();
app.use(
    cacheControl({
        public: true,
        maxAge: config.cache.maxAge,
    }),
);
app.use(route.get('/', getScripts));
app.use(route.get('/:scriptNameCalled', middlewareScript));
app.use(route.get('/:scriptNameCalled/*', middlewareScript));

export default app;
