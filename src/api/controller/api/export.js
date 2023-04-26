import Koa from 'koa';
import route from 'koa-route';
import ezs from '@ezs/core';
import Booster from '@ezs/booster';
import Storage from '@ezs/storage';
import Lodex from '@ezs/lodex';
import { PassThrough } from 'stream';
import cacheControl from 'koa-cache-control';
import config from 'config';
import URL from 'url';

import Script from '../../services/script';
import localConfig from '../../../../config.json';
import { getCleanHost } from '../../../common/uris';
import { mongoConnectionString } from '../../services/mongoClient';

ezs.use(Lodex);
ezs.use(Booster);
ezs.use(Storage);

const scripts = new Script('exporters', '../app/custom/exporters');

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

    const [, metaData, , script] = currentScript;
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
        connectionStringURI: mongoConnectionString,
        host,
    };

    const input = new PassThrough({ objectMode: true });
    const commands = ezs.parseString(script, environment);
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
    if (localConfig.pluginsAPI) {
        const statement = 'dispatch';
        const wurl = URL.parse(localConfig.pluginsAPI);
        const server = wurl.hostname;
        ctx.body = input
            .pipe(ezs(statement, { commands, server }, environment))
            .pipe(ezs.catch())
            .on('finish', emptyHandle)
            .on('error', errorHandle)
            .pipe(ezs.toBuffer());
    } else {
        const statement = 'delegate';
        ctx.body = input
            .pipe(ezs(statement, { commands }, environment))
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
