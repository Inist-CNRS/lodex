import Koa from 'koa';
import Path from 'path';
import URL from 'url';
import route from 'koa-route';
import fs from 'fs';
import ezs from 'ezs';
import request from 'request';
import { PassThrough } from 'stream';
import config from '../../../../config.json';

export const fetch = url =>
    new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }
            // simulate window.fetch polyfill
            const text = () => body;
            resolve({ text });
        });
    });

const routineLocalDirectory = Path.resolve(__dirname, '../../routines/');
const routinesLocal = config.routines
    .map(routineName =>
        Path.resolve(routineLocalDirectory, routineName.concat('.ini')),
    )
    .filter(fileName => fs.existsSync(fileName))
    .map(fileName => [
        fileName,
        ezs.metaFile(fileName),
        Path.basename(fileName, '.ini'),
        fs.readFileSync(fileName).toString(),
    ]);

const routineRepository = config.routinesRepository;
const routinesDistant = config.routines
    .map(routineName =>
        URL.resolve(routineRepository, routineName.concat('.ini')),
    )
    .map(fileName => [fileName, null, Path.basename(fileName, '.ini'), null]);

export const runRoutine = async (ctx, routineCalled) => {
    const routineLocal = routinesLocal.find(r => r[2] === routineCalled);
    const routineDistant = routinesDistant.find(r => r[2] === routineCalled);
    if (!routineLocal && routineDistant) {
        const response = await fetch(routineDistant[0]);
        const routineScript = await response.text();
        if (routineScript) {
            routineDistant[1] = ezs.metaString(routineScript);
            routineDistant[3] = routineScript;
        }
    }
    const routine = routineLocal || routineDistant;
    if (!routine) {
        throw new Error(`Unknown routine '${routineCalled}'`);
    }
    const [, metaData, , script] = routine;
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
        .pipe(ezs.toBuffer());
    if (metaData.fileName) {
        ctx.set(
            'Content-disposition',
            `attachment; filename=${metaData.fileName}`,
        );
    }
    ctx.type = metaData.mimeType;
    ctx.status = 200;
    ctx.body = output;

    input.write(context);
    input.end();
};

const app = new Koa();

app.use(route.get('/:routineCalled', runRoutine));
app.use(route.get('/:routineCalled/:field1/', runRoutine));
app.use(route.get('/:routineCalled/:field1/:field2/', runRoutine));

export default app;
