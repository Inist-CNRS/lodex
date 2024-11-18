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
import { ObjectId } from 'mongodb';

ezs.use(Basics);
const exportersScripts = new Script('exporters');
const formatExportersScripts = new Script('formatExporters');

export function getFacetsWithoutId(facets) {
    if (!facets) {
        return {};
    }
    return Object.keys(facets).reduce((acc, facetName) => {
        if (Array.isArray(facets[facetName])) {
            acc[facetName] = facets[facetName].map(
                (facetValue) => facetValue.value,
            );
        } else {
            acc[facetName] = facets[facetName];
        }
        return acc;
    }, {});
}

const parseFieldsParams = (fieldsParams) =>
    typeof fieldsParams === 'string' && fieldsParams !== ''
        ? fieldsParams.split('/').filter((x) => x)
        : '';

const middlewareScript = (isFormatExporters = false) => {
    const scripts = isFormatExporters
        ? formatExportersScripts
        : exportersScripts;

    const workersUrlPrefix = `${
        process.env.WORKERS_URL || 'http://localhost:31976'
    }/${isFormatExporters ? 'formatExporters' : 'exporters'}`;

    return async (ctx, scriptNameCalledParam, fieldsParams) => {
        const currentScript = await scripts.get(scriptNameCalledParam);
        if (!currentScript) {
            ctx.throw(404, `Unknown script '${scriptNameCalledParam}'.ini`);
        }

        const [, metaData, exporterName] = currentScript;
        const {
            sortDir,
            sortBy,
            match,
            invertedFacets,
            ...facetsWithValueIds
        } = ctx.query;
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

        let facets = {};

        for (const [facetName, facetValueIds = []] of Object.entries(
            facetsWithValueIds,
        )) {
            if (Array.isArray(facetValueIds)) {
                const facetValues = await Promise.all(
                    facetValueIds.map(async (facetValueId) => {
                        const facetValue = await ctx.publishedFacet.findOne({
                            _id: new ObjectId(facetValueId),
                        });
                        return facetValue.value;
                    }),
                );
                facets[facetName] = facetValues;
            }
        }

        const query = {
            orderBy,
            field: parseFieldsParams(fieldsParams),
            invertedFacets,
            match: match,
            ...facets,
            connectionStringURI: mongoConnectionString(ctx.tenant),
            host,
        };

        const input = new PassThrough({ objectMode: true });
        const errorHandle = (err) => {
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
        const workers_url = `${workersUrlPrefix}/${exporterName}`;
        console.error('Connecting to workers', workers_url, 'with', query);
        ctx.body = input
            .pipe(
                ezs(
                    'URLConnect',
                    {
                        url: workers_url,
                        timeout: Number(localConfig.timeout) || 120000,
                        streaming: true,
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
};

export async function getScripts(ctx) {
    ctx.body = await exportersScripts.list();
}

const app = new Koa();
app.use(
    cacheControl({
        public: true,
        maxAge: config.cache.maxAge,
    }),
);

app.use(async (ctx, next) => {
    ctx.response.set('Vary', 'X-Lodex-Tenant');
    await next();
});

app.use(route.get('/', getScripts));
app.use(route.get('/format/:scriptNameCalled', middlewareScript(true)));
app.use(route.get('/format/:scriptNameCalled/*', middlewareScript(true)));
app.use(route.get('/:scriptNameCalled', middlewareScript()));
app.use(route.get('/:scriptNameCalled/*', middlewareScript()));

export default app;
