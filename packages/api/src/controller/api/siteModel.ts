import config from 'config';
import Koa from 'koa';
import route from 'koa-route';
import { catalogModels } from '../../services/catalogModel';
import {
    getSiteModelLaunchView,
    getSiteModelView,
} from '../../services/siteModel';

export const setup = async (ctx: any, next: any) => {
    try {
        ctx.catalogModels = catalogModels;
        ctx.availableLoaders = config.get('scripts.loaders');
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: (error as Error).message };
    }
};

export const getSiteModel = async (ctx: any) => {
    ctx.body = { siteModel: await getSiteModelView(ctx) };
};

export const getSiteModelLaunch = async (ctx: any) => {
    ctx.body = { launch: await getSiteModelLaunchView(ctx) };
};

const app = new Koa();
app.use(setup);
app.use(route.get('/', getSiteModel));
app.use(route.get('/launch', getSiteModelLaunch));

export default app;
