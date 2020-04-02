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
    const connectionStringURI = `mongodb://${config.mongo.host}/${config.mongo.dbName}`;
    const environment = {
        ...localConfig,
    };
    const query = {
        field: parseFieldsParams(fieldsParams),
        ...ctx.query,
    };
    const host = getCleanHost();
    const input = new PassThrough({ objectMode: true });
    const commands = ezs.parseString(script, environment);
    const statement = scripts.useCache() ? 'boost' : 'delegate';
    const errorHandle = err => {
        ctx.status = 503;
        ctx.body.destroy();
        input.destroy();
        global.console.error('Error with ', ctx.path, ' and', ctx.query, err);
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
    if (localConfig.workersURL) {
        query.host = host;
        query.connectionStringURI = connectionStringURI;
        const wurl = URL.parse(localConfig.workersURL);
        wurl.pathname = `/routines/${scriptNameCalledParam}.ini`;
        wurl.search = qs.stringify(query, { indices: false });
        const href = URL.format(wurl);
        const response = await fetch(href);
        ctx.body = response.body
            .on('finish', emptyHandle)
            .on('error', errorHandle);
    } else {
        ctx.body = input
            .pipe(
                ezs('buildContext', { connectionStringURI, host }, environment),
            )
            .pipe(ezs(statement, { commands, key: ctx.url }, environment))
            .pipe(ezs.catch())
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
app.use(route.get('/:scriptNameCalled/*', middlewareScript));

export default app;
