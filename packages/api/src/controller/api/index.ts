import config from 'config';
import Koa from 'koa';
import jwt from 'koa-jwt';
import mount from 'koa-mount';
import route from 'koa-route';
import get from 'lodash/get';

import { ADMIN_ROLE, CONTRIBUTOR_ROLE, USER_ROLE } from '@lodex/common';
import tenant from '../../models/tenant';
import ezMasterConfig from '../../services/ezMasterConfig';
import mongoClient from '../../services/mongoClient';
import annotation from './annotation';
import breadcrumbs from './breadcrumb';
import characteristic from './characteristic';
import configTenant from './configTenant';
import dataset from './dataset';
import dataSource from './dataSource';
import displayConfig from './displayConfig';
import dump from './dump';
import enrichment from './enrichment';
import exportPublishedDataset from './export';
import exportPDFPublishedDataset from './exportPDF';
import facet from './facet';
import fieldRoutes from './field';
import hiddenResource from './hiddenResource';
import job from './job';
import loader from './loader';
import login from './login';
import logoutController from './logout';
import menu from './menu';
import parsing from './parsing';
import precomputed from './precomputed';
import progress from './progress';
import publication from './publication';
import publish from './publish';
import publishedDataset from './publishedDataset';
import run from './run';
import subresource from './subresource';
import themes from './themes';
import translate from './translate';
import upload from './upload';

const auth = config.get('auth');

const app = new Koa();

app.use(ezMasterConfig);

app.use(async (ctx: any, next: any) => {
    if (ctx.tenant !== 'admin') {
        // check if tenant exists
        const adminDb = await mongoClient('admin');
        const tenantCollection = await tenant(adminDb);
        const tenantInDb = await tenantCollection.findOne({ name: ctx.tenant });

        if (!tenantInDb) {
            ctx.status = 404;
            ctx.body = { message: `Tenant not found - ${ctx.tenant}` };
            return;
        }
    }
    return next();
});

app.use(mount('/login', login));
app.use(mount('/logout', logoutController));
app.use(route.get('/breadcrumb', breadcrumbs));
app.use(route.get('/menu', menu));
app.use(route.get('/displayConfig', displayConfig));
app.use(mount('/translations', translate));
app.use(mount('/themes', themes));

app.use(async (ctx: any, next: any) => {
    const jwtMid = await jwt({
        // @ts-expect-error TS(18046): auth is of type unknown
        secret: auth.cookieSecret,
        cookie: `lodex_token_${ctx.tenant}`,
        key: 'cookie',
        passthrough: true,
    });

    return jwtMid(ctx, next);
});

// @ts-expect-error TS(18046): auth is of type unknown
app.use(jwt({ secret: auth.headerSecret, key: 'header', passthrough: true }));

app.use(async (ctx: any, next: any) => {
    if (
        get(ctx, 'state.cookie.role') === ADMIN_ROLE &&
        get(ctx, 'state.header.role') === ADMIN_ROLE
    ) {
        ctx.state.isAdmin = true;
    }
    if (!ctx.configTenant?.userAuth?.active) {
        return next();
    }
    if (!ctx.state.cookie || !ctx.state.header) {
        ctx.status = 401;
        ctx.cookies.set(`lodex_token_${ctx.tenant}`, '', {
            expires: new Date(),
        });
        ctx.body = 'No authentication token found';
        return;
    }

    await next();
});

app.use(mount('/annotation', annotation));
app.use(mount('/export', exportPublishedDataset));
app.use(mount('/pdf', exportPDFPublishedDataset));
app.use(mount('/facet', facet));
app.use(mount('/run', run));
app.use(route.get('/publication', publication));
app.use(mount('/publishedDataset', publishedDataset));

app.use(async (ctx: any, next: any) => {
    if (!ctx.state.cookie || !ctx.state.header) {
        ctx.status = 401;
        ctx.cookies.set(`lodex_token_${ctx.tenant}`, '', {
            expires: new Date(),
        });
        ctx.body = 'No authentication token found';
        return;
    }

    if (
        get(ctx, 'state.cookie.role') === USER_ROLE &&
        get(ctx, 'state.header.role') === USER_ROLE
    ) {
        ctx.status = 404;
        return;
    }

    if (
        get(ctx, 'state.cookie.role') === CONTRIBUTOR_ROLE &&
        get(ctx, 'state.header.role') === CONTRIBUTOR_ROLE
    ) {
        ctx.status = 404;
        return;
    }

    if (
        get(ctx, 'state.cookie.role') !== ADMIN_ROLE ||
        get(ctx, 'state.header.role') !== ADMIN_ROLE
    ) {
        ctx.status = 403;
        ctx.body = 'Forbidden';
        return;
    }

    await next();
});
app.use(mount('/characteristic', characteristic));
app.use(mount('/field', fieldRoutes));
app.use(mount('/subresource', subresource));
app.use(mount('/enrichment', enrichment));
app.use(mount('/config-tenant', configTenant));
app.use(mount('/precomputed', precomputed));
app.use(mount('/job', job));
app.use(mount('/parsing', parsing));
app.use(mount('/publish', publish));
app.use(mount('/upload', upload));
app.use(mount('/dataset', dataset));
app.use(route.get('/progress', progress));
app.use(mount('/loader', loader));
app.use(route.get('/dump', dump));
app.use(mount('/hiddenResource', hiddenResource));
app.use(mount('/dataSource', dataSource));

app.use(async (ctx: any) => {
    ctx.status = 404;
});

export default app;
