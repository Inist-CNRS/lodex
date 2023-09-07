import Koa from 'koa';
import route from 'koa-route';
import ezs from '@ezs/core';
import Basics from '@ezs/basics';
import { PassThrough } from 'stream';
import cacheControl from 'koa-cache-control';
import config from 'config';

import Script from '../../services/script';
import localConfig from '../../../../config.json';
import { getCleanHost } from '../../../common/uris';
import { mongoConnectionString } from '../../services/mongoClient';

ezs.use(Basics);
const scripts = new Script('exporters');

export function getFacetsWithoutId(facets) {
    if (!facets) {
        return {};
    }
    return Object.keys(facets).reduce((acc, facetName) => {
        if (Array.isArray(facets[facetName])) {
            acc[facetName] = facets[facetName].map(
                facetValue => facetValue.value,
            );
        } else {
            acc[facetName] = facets[facetName];
        }
        return acc;
    }, {});
}

const parseFieldsParams = fieldsParams =>
    typeof fieldsParams === 'string' && fieldsParams !== ''
        ? fieldsParams.split('/').filter(x => x)
        : '';

const middlewareScript = async (ctx, scriptNameCalledParam, fieldsParams) => {
    const currentScript = await scripts.get(scriptNameCalledParam);
    if (!currentScript) {
        ctx.throw(404, `Unknown script '${scriptNameCalledParam}'.ini`);
    }

    const [, metaData, exporterName] = currentScript;
    const { sortDir, sortBy, match, ...facets } = ctx.query;

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
        sortBy || '_id',
        String(sortDir || 'asc').toLowerCase(),
    ].join('/');

    const environment = {
        ...localConfig,
    };
    const host = getCleanHost();

    const facetsWithoutId = getFacetsWithoutId(facets);

    const query = {
        orderBy,
        field: parseFieldsParams(fieldsParams),
        match: match,
        ...facetsWithoutId,
        connectionStringURI: mongoConnectionString + ctx.tenant,
        host,
    };

    const input = new PassThrough({ objectMode: true });
    const errorHandle = err => {
        ctx.status = 503;
        ctx.body.destroy();
        input.destroy();
        global.console.error('Error with ', ctx.path, ' and', ctx.query, err);
    };
    const emptyHandle = () => {
        if (ctx.headerSent === false) {
            ctx.status = 204;
            // ctx.body.write('{"total":0}');  JSON is not the only export format
            global.console.error(
                'Empty response with ',
                ctx.path,
                ' and',
                ctx.query,
            );
        }
    };
    const workers_url = `${process.env.WORKERS_URL ||
        'http://localhost:31976'}/exporters/${exporterName}`;
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
