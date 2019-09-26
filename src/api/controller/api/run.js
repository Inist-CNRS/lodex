import Koa from 'koa';
import route from 'koa-route';
import ezs from '@ezs/core';
import Booster from '@ezs/booster';
import { PassThrough } from 'stream';
import cacheControl from 'koa-cache-control';
import config from 'config';
import Script from '../../services/script';
import getPublishedDatasetFilter from '../../models/getPublishedDatasetFilter';
import getFields from '../../models/field';
import mongoClient from '../../services/mongoClient';
import Statements from '../../statements';
import localConfig from '../../../../config.json';
import { getCleanHost } from '../../../common/uris';

ezs.use(Statements);
ezs.use(Booster);

export const runRoutine = async (ctx, routineCalled, field1, field2) => {
    const routine = new Script('routines');
    const currentRoutine = await routine.get(routineCalled);
    if (!currentRoutine) {
        ctx.throw(404, `Unknown routine '${routineCalled}'`);
    }

    const [, metaData, , script] = currentRoutine;
    if (metaData.fileName) {
        ctx.set(
            'Content-disposition',
            `attachment; filename=${metaData.fileName}`,
        );
    }
    ctx.type = metaData.mimeType;
    ctx.status = 200;

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
    const field = [field1, field2].filter(x => x);
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
    const connectionStringURI = `mongodb://${config.mongo.host}/${
        config.mongo.dbName
    }`;
    // context is the intput for LodexReduceQuery & LodexRunQuery & LodexDocuments
    const context = {
        // /*
        // to build the MongoDB Query
        filter,
        field,
        fields,
        // Default parameters for ALL routines
        maxSize,
        maxValue,
        minValue,
        orderBy,
        host,
        // to externalize routine
        connectionStringURI,
    };

    const environment = {
        ...ctx.query,
        ...localConfig,
        ...context,
    };
    const input = new PassThrough({ objectMode: true });
    const commands = ezs.parseString(script, environment);
    const statement = localConfig.routinesCache ? 'booster' : 'delegate';
    const errorHandle = err => {
        ctx.status = 503;
        ctx.body.destroy();
        input.destroy();
        global.console.error('Error with ', ctx.path, ' and', ctx.query, err);
    };
    ctx.body = input
        .pipe(ezs(statement, { commands, key: ctx.url }, environment))
        .pipe(ezs.catch(e => e))
        .on('error', errorHandle)
        .pipe(ezs.toBuffer());
    input.write(context);
    input.end();
};

const app = new Koa();
app.use(
    cacheControl({
        public: true,
        maxAge: config.cache.maxAge,
    }),
);
app.use(route.get('/:routineCalled', runRoutine));
app.use(route.get('/:routineCalled/:field1/', runRoutine));
app.use(route.get('/:routineCalled/:field1/:field2/', runRoutine));

export default app;
