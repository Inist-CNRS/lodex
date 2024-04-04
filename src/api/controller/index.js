import Koa from 'koa';
import mount from 'koa-mount';
import route from 'koa-route';
import path from 'path';
import { simulatedLatency } from 'config';
import api from './api';
import front from './front';
import embedded from './embedded';
import customPage from './customPage';
import webhook from './webhook';
import rootAdmin from './rootAdmin';

import repositoryMiddleware, {
    mongoRootAdminClient,
} from '../services/repositoryMiddleware';
import fs from 'fs';
import { DEFAULT_TENANT } from '../../common/tools/tenantTools';

const app = new Koa();

const simulateLatency = (ms) => async (ctx, next) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
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

const render404IndexHtml = (ctx) => {
    ctx.body = fs
        .readFileSync(path.resolve(__dirname, '../../app/404.html'))
        .toString();
};

// Create a middleware that will check if the current url contains a tenant exisiting in the database
// If not, it will redirect to the an 404 error page
app.use(async (ctx, next) => {
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
const configTenantInstanceMiddleware = async (ctx, next) => {
    const configTenant = await ctx.configTenantCollection.findLast();
    if (!configTenant || !configTenant.front) {
        await next();
        return;
    }

    ctx.configTenant = configTenant;

    ctx.configTenant.leftMenu = configTenant?.front.menu.filter(
        ({ position }) => position === 'left',
    );
    ctx.configTenant.rightMenu = configTenant?.front.menu.filter(
        ({ position }) => position === 'right',
    );
    ctx.configTenant.advancedMenu = configTenant?.front.menu.filter(
        ({ position }) =>
            position === 'advanced' ||
            position === 'top' ||
            position === 'bottom',
    );

    ctx.configTenant.customRoutes = configTenant?.front.menu
        .filter(({ role }) => role === 'custom')
        .map(({ link }) => link);

    ctx.configTenant.advancedMenuButton =
        configTenant?.front.advancedMenuButton;

    await next();
};

app.use(configTenantInstanceMiddleware);

app.use(mount('/webhook', webhook));
app.use(mount('/embedded', embedded));
app.use(mount('/api', api));

app.use(route.get('/customPage/', customPage));

app.use(mount('/', front));

export default app;
