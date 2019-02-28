import Koa from 'koa';
import route from 'koa-route';
import ezs from 'ezs';
import { PassThrough } from 'stream';
import cacheControl from 'koa-cache-control';
import config from 'config';
import Script from '../../services/script';

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
    const fields = [field1, field2].filter(x => x);
    const environment = {
        ...ctx.query,
        ...config,
        fields,
    };
    const input = new PassThrough({ objectMode: true });
    const commands = ezs.parseString(script, environment);
    const method = config.routinesCache ? 'pipeline' : 'booster';
    const errorHandle = err => {
        ctx.status = 503;
        ctx.body.destroy();
        input.destroy();
        global.console.error(ctx.query, err);
    };
    const handle = ezs[method](commands, environment).on('error', errorHandle);

    ctx.body = input
        .pipe(handle)
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
