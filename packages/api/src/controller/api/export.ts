import Koa from 'koa';
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
// @ts-expect-error TS(2792): Cannot find module '@ezs/basics'. Did you mean to ... Remove this comment to see the full error message
import Basics from '@ezs/basics';
import { PassThrough } from 'stream';
import cacheControl from 'koa-cache-control';
import config from 'config';

import Script from '../../services/script';
import localConfig from '../../../../../config.json';
import { getCleanHost } from '@lodex/common';
import { mongoConnectionString } from '../../services/mongoClient';
import { ObjectId } from 'mongodb';

ezs.use(Basics);
const exportersScripts = new Script('exporters');
const formatExportersScripts = new Script('formatExporters');

export function getFacetsWithoutId(facets: any) {
    if (!facets) {
        return {};
    }
    return Object.keys(facets).reduce((acc: any, facetName: any) => {
        if (Array.isArray(facets[facetName])) {
            acc[facetName] = facets[facetName].map(
                (facetValue: any) => facetValue.value,
            );
        } else {
            acc[facetName] = facets[facetName];
        }
        return acc;
    }, {});
}

const parseFieldsParams = (fieldsParams: any) =>
    typeof fieldsParams === 'string' && fieldsParams !== ''
        ? fieldsParams.split('/').filter((x: any) => x)
        : '';

const middlewareScript = (isFormatExporters = false) => {
    const scripts = isFormatExporters
        ? formatExportersScripts
        : exportersScripts;

    const workersUrlPrefix = `${
        process.env.WORKERS_URL || 'http://localhost:31976'
    }/${isFormatExporters ? 'formatExporters' : 'exporters'}`;

    return async (ctx: any, scriptNameCalledParam: any, fieldsParams: any) => {
        const currentScript = await scripts.get(scriptNameCalledParam);
        if (!currentScript) {
            ctx.throw(404, `Unknown script '${scriptNameCalledParam}'.ini`);
        }

        const [, metaData, exporterName] = currentScript;
        const {
            uri,
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

        const facets = {};

        for (const [facetName, facetValueIds = []] of Object.entries(
            facetsWithValueIds,
        )) {
            if (Array.isArray(facetValueIds)) {
                const facetValues = await Promise.all(
                    facetValueIds.map(async (facetValueId: any) => {
                        const facetValue = await ctx.publishedFacet.findOne({
                            _id: new ObjectId(facetValueId),
                        });
                        return facetValue.value;
                    }),
                );
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
            uri,
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
    };
};

export async function getScripts(ctx: any) {
    ctx.body = await exportersScripts.list();
}

const app = new Koa();
app.use(
    cacheControl({
        public: true,
        maxAge: config.get('cache.maxAge'),
    }),
);

app.use(async (ctx: any, next: any) => {
    ctx.response.set('Vary', 'X-Lodex-Tenant');
    await next();
});

app.use(route.get('/', getScripts));
app.use(route.get('/format/:scriptNameCalled', middlewareScript(true)));
app.use(route.get('/format/:scriptNameCalled/(.*)', middlewareScript(true)));
app.use(route.get('/:scriptNameCalled', middlewareScript()));
app.use(route.get('/:scriptNameCalled/(.*)', middlewareScript()));

export default app;
