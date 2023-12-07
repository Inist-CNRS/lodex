import Koa from 'koa';
import route from 'koa-route';
import ezs from '@ezs/core';
import Lodex from '@ezs/lodex';
import { PassThrough } from 'stream';
import cacheControl from 'koa-cache-control';
import config from 'config';

import Script from '../../services/script';
import { getCleanHost } from '../../../common/uris';
import { mongoConnectionString } from '../../services/mongoClient';

ezs.use(Lodex);

const scripts = new Script('routines');

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
        const workers_url = `${process.env.WORKERS_URL ||
            'http://localhost:31976'}/routines/${routineName}?${
            ctx.querystring
        }`;
        console.error('Connecting to workers', workers_url, 'with', query);
        ctx.body = input
            .pipe(
                ezs(
                    'URLConnect',
                    {
                        url: workers_url,
                        timeout: 120000,
                        retries: 1,
                        json: false,
                        encoder: 'pack',
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

app.use(async (ctx, next) => {
    await next();
    ctx.response.set('Vary', 'X-Lodex-Tenant');
});

app.use(route.get('/', getScripts));
app.use(route.get('/:scriptNameCalled', middlewareScript));
app.use(route.get('/:scriptNameCalled/*', middlewareScript));

export default app;
