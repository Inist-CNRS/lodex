import Koa from 'koa';
import route from 'koa-route';
import ezs from 'ezs';
import { PassThrough } from 'stream';
import hasher from 'node-object-hash';
import cacheControl from 'koa-cache-control';
import config from 'config';
import Script from '../../services/script';

const hashCoerce = hasher({
    sort: false,
    coerce: true,
});
const cacheOptions = {
    max: config.cache.max,
    maxAge: config.cache.maxAge * 1000,
};
const cache = ezs.createCache(cacheOptions);

export const runRoutine = async (ctx, routineCalled) => {
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

    const context = {
        headers: ctx.headers,
        method: ctx.method,
        url: ctx.url,
        originalUrl: ctx.originalUrl,
        origin: ctx.origin,
        href: ctx.href,
        path: ctx.path,
        query: ctx.query,
        querystring: ctx.querystring,
        host: ctx.host,
        hostname: ctx.hostname,
    };
    const uniqHash = hashCoerce.hash([
        __filename,
        context.path,
        context.querystring,
    ]);
    const uniqkey = `id-${uniqHash}`;
    const cached = cache.get(uniqkey);

    let result;
    if (cached) {
        result = cached;
    } else {
        const input = new PassThrough({ objectMode: true });
        result = input
            .pipe(ezs.fromString(script))
            .pipe(ezs.catch(global.console.error))
            .pipe(ezs.toBuffer())
            .pipe(cache.set(uniqkey));
        input.write(context);
        input.end();
    }
    ctx.body = result;
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
