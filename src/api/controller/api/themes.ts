import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import { getTheme, getAvailableThemes } from '../../models/themes';

const setup = async (ctx: any, next: any) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
    }
};

export const getThemes = async (ctx: any) => {
    ctx.body = getAvailableThemes();
};

export const getMuiTheme = async (ctx: any) => {
    const config = await ctx.configTenantCollection.findLast();
    const theme = getTheme(config.theme);
    ctx.body = theme.muiTheme;
};

const app = new Koa();

app.use(setup);
app.use(route.get('/', getThemes));
app.use(route.get('/current', getMuiTheme));
app.use(koaBodyParser());

export default app;
