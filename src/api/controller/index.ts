// @ts-expect-error TS(2792): Cannot find module 'config'. Did you mean to set t... Remove this comment to see the full error message
import { simulatedLatency } from 'config';
// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-mount'. Did you mean to se... Remove this comment to see the full error message
import mount from 'koa-mount';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module 'lodash/merge'. Did you mean to... Remove this comment to see the full error message
import merge from 'lodash/merge';
import path from 'path';
import api from './api';
// @ts-expect-error TS(7016): Could not find a declaration file for module './cu... Remove this comment to see the full error message
import customPage from './customPage';
import embedded from './embedded';
// @ts-expect-error TS(7016): Could not find a declaration file for module './fr... Remove this comment to see the full error message
import front from './front';
import rootAdmin from './rootAdmin';
import webhook from './webhook';

import fs from 'fs';
// @ts-expect-error TS(2792): Cannot find module 'lodash'. Did you mean to set t... Remove this comment to see the full error message
import { cloneDeep } from 'lodash';
import configTenantDefault from '../../../configTenant.json';
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { DEFAULT_TENANT } from '../../common/tools/tenantTools';
import repositoryMiddleware, {
    mongoRootAdminClient,
} from '../services/repositoryMiddleware';

const app = new Koa();

// @ts-expect-error TS(2697): An async function or method must return a 'Promise... Remove this comment to see the full error message
const simulateLatency = (ms: any) => async (ctx: any, next: any) => {
    await new Promise((resolve: any) => setTimeout(resolve, ms));
    await next();
};

if (simulatedLatency) {
    app.use(simulateLatency(simulatedLatency));
}

app.use(mongoRootAdminClient);
app.use(mount('/rootAdmin', rootAdmin));

// #######################
// # 404 error middleware
// #######################

const render404IndexHtml = (ctx: any) => {
    ctx.body = fs
        .readFileSync(path.resolve(__dirname, '../../app/404.html'))
        .toString();
};

// Create a middleware that will check if the current url contains a tenant exisiting in the database
// If not, it will redirect to the an 404 error page
app.use(async (ctx: any, next: any) => {
    const { url } = ctx.request;

    // If url is 404 and doesnt contains api/ we skip all middlewares
    if (url.match(/404/) && !url.match(/api/)) {
        render404IndexHtml(ctx);
        return;
    }

    // eslint-disable-next-line no-useless-escape
    const matchInstance = url.match(/instance\/([^\/]*)(.*)/);
    // If url is /instances we pass to the next middleware
    if (!matchInstance) {
        await next();
        return;
    }

    const [, tenantSlug] = matchInstance;
    const tenantInfo = await ctx.tenantCollection.findOneByName(
        tenantSlug.toLowerCase(),
    );
    if (!tenantInfo && tenantSlug !== DEFAULT_TENANT) {
        ctx.redirect('/404');
        return;
    }

    await next();
});

// ############################
// # CURRENT CONFIG MIDDLEWARE
// ###########################
app.use(repositoryMiddleware);
const configTenantInstanceMiddleware = async (ctx: any, next: any) => {
    const configTenant = await ctx.configTenantCollection.findLast();

    ctx.configTenant = merge(
        cloneDeep(configTenantDefault),
        configTenant || {},
    );

    ctx.configTenant.leftMenu = []
        .concat(configTenant?.front?.menu)
        .filter(Boolean)
        .filter((item: any) => item.position)
        .filter(({ position }: any) => position === 'left');
    ctx.configTenant.rightMenu = []
        .concat(configTenant?.front?.menu)
        .filter(Boolean)
        .filter((item: any) => item.position)
        .filter(({ position }: any) => position === 'right');
    ctx.configTenant.advancedMenu = []
        .concat(configTenant?.front?.menu)
        .filter(Boolean)
        .filter((item: any) => item.position)
        .filter(
            ({ position }: any) =>
                position === 'advanced' ||
                position === 'top' ||
                position === 'bottom',
        );
    ctx.configTenant.customRoutes = []
        .concat(configTenant?.front?.menu)
        .filter(Boolean)
        .filter((item: any) => item.role)
        .filter(({ role }: any) => role === 'custom')
        .map(({ link }: any) => link);

    ctx.configTenant.advancedMenuButton =
        configTenant?.front?.advancedMenuButton;

    ctx.configTenant.breadcrumb = []
        .concat(configTenant?.front?.breadcrumb)
        .filter(Boolean);
    await next();
};

app.use(configTenantInstanceMiddleware);

app.use(mount('/webhook', webhook));
app.use(mount('/embedded', embedded));
app.use(mount('/api', api));

app.use(route.get('/customPage/', customPage));

app.use(mount('/', front));

export default app;
