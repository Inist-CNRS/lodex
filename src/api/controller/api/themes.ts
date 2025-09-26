// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module 'koa-bodyparser'. Did you mean ... Remove this comment to see the full error message
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
