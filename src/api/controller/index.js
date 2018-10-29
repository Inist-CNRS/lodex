import Koa from 'koa';
import mount from 'koa-mount';
import route from 'koa-route';
import path from 'path';

import { simulatedLatency } from 'config';
import api from './api';
import front from './front';
import { readFile } from '../services/fsHelpers';

const app = new Koa();

const simulateLatency = ms => async (ctx, next) => {
    await new Promise(resolve => setTimeout(resolve, ms));
    await next();
};

if (simulatedLatency) {
    app.use(simulateLatency(simulatedLatency));
}

app.use(mount('/api', api));

const scriptRegEx = new RegExp('<script( src=".*")?>.*?</script>', 'gm');

app.use(
    route.get('/customPage/:file', async (ctx, file) => {
        const html = (await readFile(
            path.resolve(__dirname, `../../app/custom/${file}`),
        )).toString();

        const scripts = html
            .match(scriptRegEx)
            .map(script => {
                const src = script.match(/<script src="(.*)">/);
                console.log({ src });
                return src && src[1];
            })
            .filter(src => !!src);

        console.log({ scripts });

        ctx.body = { html, scripts };
    }),
);

app.use(mount('/', front));

export default app;
