import Koa from 'koa';
import route from 'koa-route';
import ezs from 'ezs';
import { PassThrough } from 'stream';
import cacheControl from 'koa-cache-control';
import config from 'config';
import Script from '../../services/script';
import getPublishedDatasetFilter from '../../models/getPublishedDatasetFilter';
import field from '../../models/field';
import mongoClient from '../../services/mongoClient';
import Statements from '../../statements';
import localConfig from '../../../../config.json';

ezs.use(Statements);

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
    const [order, dir] = orderBy.split('/');
    const handleDb = await mongoClient();
    const fieldHandle = await field(handleDb);
    const searchableFieldNames = await fieldHandle.findSearchableNames();
    const facetFieldNames = await fieldHandle.findFacetNames();
    const filter = getPublishedDatasetFilter({
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
        limit: Number(maxSize) || 200,
        skip,
        sort: {
            [order]: dir === 'asc' ? 1 : -1,
        },
        filter,
        maxValue,
        minValue,
        connectionStringURI,
    };
    // to by pass all statements before
    ezs.config('LodexRunQuery', context);
    ezs.config('LodexReduceQuery', context);
    ezs.config('LodexDocuments', context);

    const fields = [field1, field2].filter(x => x);
    const environment = {
        ...ctx.query,
        ...localConfig,
        fields,
    };
    const input = new PassThrough({ objectMode: true });
    const commands = ezs.parseString(script, environment);
    const method = localConfig.routinesCache ? 'booster' : 'pipeline';
    const errorHandle = err => {
        ctx.status = 503;
        ctx.body.destroy();
        input.destroy();
        global.console.error(ctx.query, err);
    };
    const routineHandle = ezs[method](commands, environment).on(
        'error',
        errorHandle,
    );

    ctx.body = input
        .pipe(routineHandle)
        .pipe(ezs.catch(errorHandle))
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
