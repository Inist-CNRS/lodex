import Koa from 'koa';
import mount from 'koa-mount';
import route from 'koa-route';

import { simulatedLatency, mongo } from 'config';
import api from './api';
import front from './front';
import embedded from './embedded';
import customPage from './customPage';

import repositoryMiddleware from '../services/repositoryMiddleware';
import progress from '../services/progress';

const app = new Koa();

const simulateLatency = ms => async (ctx, next) => {
    await new Promise(resolve => setTimeout(resolve, ms));
    await next();
};

const setTenant = async (ctx, next) => {
    ctx.tenant = ctx.cookies.get('lodex_tenant') || mongo.dbName;
    progress.initialize(ctx.tenant);
    await next();
};

app.use(setTenant);

if (simulatedLatency) {
    app.use(simulateLatency(simulatedLatency));
}

app.use(repositoryMiddleware);

app.use(mount('/embedded', embedded));
app.use(mount('/api', api));

app.use(route.get('/customPage/', customPage));

app.use(mount('/', front));

export default app;
