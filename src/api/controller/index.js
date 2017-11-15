import path from 'path';
import serve from 'koa-static';
import Koa from 'koa';
import mount from 'koa-mount';

import { simulatedLatency } from 'config';
import api from './api';
import front from './front';

const app = new Koa();

const simulateLatency = ms => async (ctx, next) => {
    await new Promise(resolve => setTimeout(resolve, ms));
    await next();
};

if (simulatedLatency) {
    app.use(simulateLatency(simulatedLatency));
}
app.use(mount('/admin', serve(path.resolve(__dirname, '../../build/admin'))));
app.use(mount('/api', api));
app.use(mount('/', front));

export default app;
