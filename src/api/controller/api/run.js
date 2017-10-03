import Koa from 'koa';
import Path from 'path';
import URL from 'url';
import route from 'koa-route';
import fs from 'fs';
import ezs from 'ezs';
import fetch from 'omni-fetch';
import { PassThrough } from 'stream';
import config from '../../../../config.json';


const routineLocalDirectory = Path.resolve(__dirname, '../../routines/');
const routinesLocal = config.routines
    .map(routineName => Path.resolve(routineLocalDirectory, routineName.concat('.ezs')))
    .filter(fileName => fs.existsSync(fileName))
    .map(fileName => [
        fileName,
        ezs.metaFile(fileName),
        Path.basename(fileName, '.ezs'),
        fs.readFileSync(fileName).toString(),
    ]);

const routineRepository = config.routinesRepository;
const routinesDistant = config.routines
    .map(routineName => URL.resolve(routineRepository, routineName.concat('.ezs')))
    .map(fileName => [
        fileName,
        null,
        Path.basename(fileName, '.ezs'),
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
            routineDistant[1] = ezs.metaString(routineScript);
            routineDistant[3] = routineScript;
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
