import Koa from 'koa';
import route from 'koa-route';
import mount from 'koa-mount';
import jwt from 'koa-jwt';
import { auth } from 'config';
import get from 'lodash/get';

import ezMasterConfig from '../../services/ezMasterConfig';
import characteristic from './characteristic';
import exportPublishedDataset from './export';
import exportPDFPublishedDataset from './exportPDF';
import facet from './facet';
import fieldRoutes from './field';
import login from './login';
import logoutController from './logout';
import parsing from './parsing';
import publication from './publication';
import publish from './publish';
import publishedDataset from './publishedDataset';
import dataset from './dataset';
import upload from './upload';
import run from './run';
import progress from './progress';
import breadcrumbs from './breadcrumb';
import menu from './menu';
import loader from './loader';
import translate from './translate';
import subresource from './subresource';
import enrichment from './enrichment';
import configTenant from './configTenant';
import themes from './themes';
import precomputed from './precomputed';
import job from './job';
import dump from './dump';
import hiddenResource from './hiddenResource';
import displayConfig from './displayConfig';
import { ADMIN_ROLE } from '../../../common/tools/tenantTools';
import mongoClient from '../../services/mongoClient';
import tenant from '../../models/tenant';

const app = new Koa();

app.use(ezMasterConfig);

app.use(async (ctx, next) => {
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

app.use(async (ctx, next) => {
    const jwtMid = await jwt({
        secret: auth.cookieSecret,
        cookie: `lodex_token_${ctx.tenant}`,
        key: 'cookie',
        passthrough: true,
    });
    return jwtMid(ctx, next);
});

app.use(jwt({ secret: auth.headerSecret, key: 'header', passthrough: true }));

app.use(async (ctx, next) => {
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

app.use(mount('/export', exportPublishedDataset));
app.use(mount('/pdf', exportPDFPublishedDataset));
app.use(mount('/facet', facet));
app.use(mount('/run', run));
app.use(route.get('/publication', publication));
app.use(mount('/publishedDataset', publishedDataset));

app.use(async (ctx, next) => {
    if (!ctx.state.cookie || !ctx.state.header) {
        ctx.status = 401;
        ctx.cookies.set(`lodex_token_${ctx.tenant}`, '', {
            expires: new Date(),
        });
        ctx.body = 'No authentication token found';
        return;
    }

    if (
        get(ctx, 'state.cookie.role') === 'user' &&
        get(ctx, 'state.header.role') === 'user'
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

app.use(async ctx => {
    ctx.status = 404;
});

export default app;
