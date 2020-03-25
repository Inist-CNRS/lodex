import Koa from 'koa';
import route from 'koa-route';
import ezs from '@ezs/core';
import Storage from '@ezs/storage';
import { PassThrough } from 'stream';
import cacheControl from 'koa-cache-control';
import config from 'config';

import Script from '../../services/script';
import mongoClient from '../../services/mongoClient';
import getPublishedDatasetFilter from '../../models/getPublishedDatasetFilter';
import getFields from '../../models/field';
import Statements from '../../statements';
import localConfig from '../../../../config.json';
import { getCleanHost } from '../../../common/uris';

ezs.use(Statements);
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

    const {
        uri,
        maxSize,
        skip,
        maxValue,
        minValue,
        match,
        orderBy = '_id/asc',
        invertedFacets = [],
        $query,
        ...facets
    } = ctx.query;
    const host = getCleanHost();
    const field = parseFieldsParams(fieldsParams);
    const handleDb = await mongoClient();
    const fieldHandle = await getFields(handleDb);
    const searchableFieldNames = await fieldHandle.findSearchableNames();
    const facetFieldNames = await fieldHandle.findFacetNames();
    const fields = await fieldHandle.findAll();
    const filter = getPublishedDatasetFilter({
        uri,
        match,
        invertedFacets,
        facets,
        ...$query,
        searchableFieldNames,
        facetFieldNames,
    });

    if (filter.$and && !filter.$and.length) {
        delete filter.$and;
    }
    const connectionStringURI = `mongodb://${config.mongo.host}/${config.mongo.dbName}`;
    // context is the intput for LodexReduceQuery & LodexRunQuery & LodexDocuments
    const context = {
        // /*
        // to build the MongoDB Query
        filter,
        field,
        fields,
        // Default parameters for ALL scripts
        maxSize,
        maxValue,
        minValue,
        orderBy,
        uri,
        host,
        // to allow script to connect to MongoDB
        connectionStringURI,
    };

    const environment = {
        ...ctx.query,
        ...localConfig,
        ...context,
    };
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
    ctx.body = input
        .pipe(ezs(statement, { commands, key: ctx.url }, environment))
        .pipe(ezs.catch(e => e))
        .on('finish', emptyHandle)
        .on('error', errorHandle)
        .pipe(ezs.toBuffer());
    input.write(context);
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
