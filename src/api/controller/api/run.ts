// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message

import ezs from '@ezs/core';
// @ts-expect-error TS(2792): Cannot find module '@ezs/lodex'. Did you mean to s... Remove this comment to see the full error message
import Lodex from '@ezs/lodex';
import { PassThrough } from 'stream';
// @ts-expect-error TS(2792): Cannot find module 'koa-cache-control'. Did you me... Remove this comment to see the full error message
import cacheControl from 'koa-cache-control';
// @ts-expect-error TS(2792): Cannot find module 'config'. Did you mean to set t... Remove this comment to see the full error message
import config from 'config';

import Script from '../../services/script';
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { getCleanHost } from '../../../common/uris';
import { mongoConnectionString } from '../../services/mongoClient';
import localConfig from '../../../../config.json';

ezs.use(Lodex);

const scripts = new Script('routines');

const parseFieldsParams = (fieldsParams: any) =>
    typeof fieldsParams === 'string' && fieldsParams !== ''
        ? fieldsParams.split('/').filter((x: any) => x)
        : '';

const middlewareScript = async (
    ctx: any,
    scriptNameCalledParam: any,
    fieldsParams: any,
) => {
    const currentScript = await scripts.get(scriptNameCalledParam);
    if (!currentScript) {
        ctx.throw(404, `Unknown script '${scriptNameCalledParam}'.ini`);
    }

    try {
        const [, metaData, routineName] = currentScript;
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
        const environment = {};
        const host = getCleanHost();
        const query = {
            orderBy,
            field,
            ...ctx.query,
            tenant: ctx.tenant,
            connectionStringURI: mongoConnectionString(ctx.tenant),
            host,
        };
        const input = new PassThrough({ objectMode: true });
        const errorHandle = (err: any) => {
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
        const workers_url = `${
            process.env.WORKERS_URL || 'http://localhost:31976'
        }/routines/${routineName}?${ctx.querystring}`;
        console.error('Connecting to workers', workers_url, 'with', query);

        const script = `
        [use]
        plugin = basics

        ; decode dat from the parent process
        [unpack]

        ; connect to the ezs server
        [URLConnect]
        url = ${workers_url}
        // @ts-expect-error TS(2304): Cannot find name 'Number'.
        timeout = ${Number(localConfig.timeout) || 120000}
        streaming = true,
        json = false
        encoder = pack

        `;
        ctx.body = input
            .pipe(ezs('pack')) // encode to transfert to the thread
            .pipe(
                ezs(
                    'detach', // thread dedicated to processing the response, otherwise you can simply use “delegate”
                    {
                        script,
                        encoder: 'transit',
                        decoder: 'transit',
                    },
                    environment,
                ),
            )
            .pipe(ezs.catch())
            .on('finish', emptyHandle)
            .on('error', errorHandle)
            .pipe(ezs.toBuffer());
        input.write(query);
        input.end();
    } catch (err) {
        console.error(err);
        ctx.throw(500, err);
    }
};

export async function getScripts(ctx: any) {
    ctx.body = await scripts.list();
}

const app = new Koa();
app.use(
    cacheControl({
        public: true,
        maxAge: config.cache.maxAge,
    }),
);

app.use(async (ctx: any, next: any) => {
    await next();
    ctx.response.set('Vary', 'X-Lodex-Tenant');
});

app.use(route.get('/', getScripts));
app.use(route.get('/:scriptNameCalled', middlewareScript));
app.use(route.get('/:scriptNameCalled/(.*)', middlewareScript));

export default app;
