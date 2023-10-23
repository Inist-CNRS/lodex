import Koa from 'koa';
import mount from 'koa-mount';
import route from 'koa-route';
import path from 'path';
import { simulatedLatency } from 'config';
import api from './api';
import front from './front';
import embedded from './embedded';
import customPage from './customPage';
import rootAdmin from './rootAdmin';

import repositoryMiddleware from '../services/repositoryMiddleware';
import tenant from '../models/tenant';
import mongoClient from '../services/mongoClient';
import fs from 'fs';
import { DEFAULT_TENANT } from '../../common/tools/tenantTools';

const app = new Koa();

const simulateLatency = ms => async (ctx, next) => {
    await new Promise(resolve => setTimeout(resolve, ms));
    await next();
};

if (simulatedLatency) {
    app.use(simulateLatency(simulatedLatency));
}

app.use(mount('/rootAdmin', rootAdmin));

// #######################
// # 404 error middleware
// #######################

const render404IndexHtml = ctx => {
    ctx.body = fs
        .readFileSync(path.resolve(__dirname, '../../app/404.html'))
        .toString();
};

// Create a middleware that will check if the current url contains a tenant exisiting in the database
// If not, it will redirect to the an 404 error page
app.use(async (ctx, next) => {
    const { url } = ctx.request;

    // If url is 404 we skip all middlewares
    if (url.match(/404/)) {
        render404IndexHtml(ctx);
        return;
    }

    // eslint-disable-next-line no-useless-escape
    const matchInstance = url.match(/instance\/([^\/]*)(.*)/);
    // If url is /instances or /__webpack_hmr we pass to the next middleware
    if (!matchInstance) {
        await next();
        return;
    }

    const [, tenantSlug] = matchInstance;
    const adminDb = await mongoClient('admin');
    const tenantCollection = await tenant(adminDb);
    const tenantInfo = await tenantCollection.findOneByName(tenantSlug);
    if (!tenantInfo && tenantSlug !== DEFAULT_TENANT) {
        ctx.redirect('/404');
        return;
    }

    await next();
});

app.use(repositoryMiddleware);

app.use(mount('/embedded', embedded));
app.use(mount('/api', api));

app.use(route.get('/customPage/', customPage));

app.use(mount('/', front));

export default app;
