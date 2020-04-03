import Koa from 'koa';
import route from 'koa-route';
import ezs from '@ezs/core';
import Booster from '@ezs/booster';
import Lodex from '@ezs/lodex';
import Analytics from '@ezs/analytics';
import { PassThrough } from 'stream';
import cacheControl from 'koa-cache-control';
import config from 'config';
import fetch from 'fetch-with-proxy';
import URL from 'url';
import qs from 'qs';

import Script from '../../services/script';
import localConfig from '../../../../config.json';
import { getCleanHost } from '../../../common/uris';

ezs.use(Booster);
ezs.use(Lodex);
ezs.use(Analytics);

const scripts = new Script('exporters', '../app/custom/exporters');

const middlewareScript = async (ctx, scriptNameCalled) => {
    const currentScript = await scripts.get(scriptNameCalled);
    if (!currentScript) {
        ctx.throw(404, `Unknown script '${scriptNameCalled}'.ini`);
    }

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

    const connectionStringURI = `mongodb://${config.mongo.host}/${config.mongo.dbName}`;
    const environment = {
        ...localConfig,
    };
    const query = {
        orderBy,
        ...ctx.query,
    };
    const host = getCleanHost();
    const input = new PassThrough({ objectMode: true });
    const commands = ezs.parseString(script, environment);
    const statement = scripts.useCache() ? 'booster' : 'delegate';
    const errorHandle = err => {
        ctx.status = 503;
        ctx.body.destroy();
        input.destroy();
        global.console.error('Error with ', ctx.path, ' and', ctx.query, err);
    };
    const emptyHandle = () => {
        if (ctx.headerSent === false) {
            ctx.status = 204;
            global.console.error(
                'Empty response with ',
                ctx.path,
                ' and',
                ctx.query,
            );
        }
    };
    if (localConfig.pluginsAPI) {
        query.host = host;
        query.connectionStringURI = connectionStringURI;
        const wurl = URL.parse(localConfig.pluginsAPI);
        wurl.pathname = `/exporters/${scriptNameCalled}.ini`;
        wurl.search = qs.stringify(query, { indices: false });
        const href = URL.format(wurl);
        const response = await fetch(href);
        ctx.body = response.body
            .on('finish', emptyHandle)
            .on('error', errorHandle);
    } else {
        ctx.body = input
            .pipe(ezs('buildContext', { connectionStringURI, host }, environment))
            .pipe(ezs('LodexRunQuery', {}, environment))
            .pipe(ezs('greater', { path: 'total', than: 1 }))
            .pipe(ezs('filterVersions'))
            .pipe(ezs('filterContributions'))
            .pipe(ezs(statement, { commands, key: ctx.url }, environment))
            .pipe(ezs.catch(e => e))
            .on('finish', emptyHandle)
            .on('error', errorHandle)
            .pipe(ezs.toBuffer());
    }
    input.write(query);
    input.end();
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

export default app;
