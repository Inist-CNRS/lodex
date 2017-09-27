import Koa from 'koa';
import { resolve, basename } from 'path';
import route from 'koa-route';
import fs from 'fs';
import ezs from 'ezs';
import fetch from 'omni-fetch';
import { PassThrough } from 'stream';
import config from '../../../../config.json';


const routineLocalDirectory = resolve(__dirname, '../../routines/');
const routinesLocal = config.routines
    .map(routineName => resolve(routineLocalDirectory, routineName.concat('.ezs')))
    .filter(fileName => fs.existsSync(fileName))
    .map(fileName => [
        fileName,
        ezs.metaFile(fileName),
        basename(fileName, '.ezs'),
        fs.readFileSync(fileName).toString(),
    ]);

const routineRepository = 'https://raw.githubusercontent.com/Inist-CNRS/lodex/master/';
const routinesDistant = config.routines
    .map(routineName => resolve(routineRepository, routineName.concat('.ezs')))
    .map(fileName => [
        fileName,
        null,
        basename(fileName, '.ezs'),
        null,
    ]);


export const runRoutine = async (ctx, local) => {
    const routineLocal = routinesLocal.filter(r => r[2] === local)[0];
    const routineDistant = routinesDistant.filter(r => r[2] === local)[0];

    if (!routineLocal && routineDistant) {
        const routineScript = await fetch(routineDistant[0]).then((response) => {
            if (response.status >= 400) {
                throw new Error('Bad response from server');
            }
            return response.text();
        });
        if (routineScript) {
            routinesDistant[1] = ezs.metaString(routineScript);
            routinesDistant[3] = routineScript;
        }
    }
    const routine = routineLocal || routineDistant;
    if (!routine) {
        throw new Error(`Unknown routine '${local}'`);
    }
    const [, metaData, , script] = routine;
    const query = ctx.request.querystring || 'XX';
    const input = new PassThrough({ objectMode: true });
    const output = input
        .pipe(ezs.fromString(script))
        .pipe(ezs((data, feed) => {
            if (data instanceof Error) {
                global.console.error('Error in pipeline.', data);
                feed.end();
            } else {
                feed.send(data);
            }
        }))
        .pipe(ezs.toBuffer())
    ;
    if (metaData.fileName) {
        ctx.set('Content-disposition', `attachment; filename=${metaData.fileName}`);
    }
    ctx.type = metaData.mimeType;
    ctx.status = 200;
    ctx.body = output;

    input.write(query);
    input.end();
};

const app = new Koa();

app.use(route.get('/:routineName', runRoutine));

export default app;
