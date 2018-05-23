import Koa from 'koa';
import route from 'koa-route';
import ezs from 'ezs';
import { PassThrough } from 'stream';
import Cache from 'streaming-cache';
import cacheControl from 'koa-cache-control';
import config from '../../../../config.json';
import Script from '../../services/script';

const memory = new Cache({
    max: config.memoryCacheMaxSize || 5,
    maxAge: config.memoryCacheMaxAge || 10000,
});

const routine = new Script('routines');
export const runRoutine = async (ctx, routineCalled) => {
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
    const uniqkey = `${context.path}?${context.querystring}`;

    const cached = memory.get(uniqkey);
    if (cached) {
        ctx.body = cached;
    } else {
        const input = new PassThrough({ objectMode: true });
        const output = input
            .pipe(ezs.fromString(script))
            .pipe(
                ezs((data, feed) => {
                    if (data instanceof Error) {
                        global.console.error('Error in pipeline.', data);
                        feed.end();
                    } else {
                        feed.send(data);
                    }
                }),
            )
            .pipe(ezs.toBuffer())
            .pipe(memory.set(uniqkey));

        ctx.body = output;

        input.write(context);
        input.end();
    }
};

const app = new Koa();
app.use(
    cacheControl({
        public: true,
        maxAge: 24 * 60 * 60,
    }),
);
app.use(route.get('/:routineCalled', runRoutine));
app.use(route.get('/:routineCalled/:field1/', runRoutine));
app.use(route.get('/:routineCalled/:field1/:field2/', runRoutine));

export default app;
