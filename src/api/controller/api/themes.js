import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import { getTheme, getAvailableThemes } from '../../models/themes';

const setup = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
};

export const getThemes = async (ctx) => {
    ctx.body = getAvailableThemes();
};

export const getCustomTheme = async (ctx) => {
    const config = await ctx.configTenantCollection.findLast();
    const theme = getTheme(config.theme);
    ctx.body = theme.customTheme;
};

const app = new Koa();

app.use(setup);
app.use(route.get('/', getThemes));
app.use(route.get('/current', getCustomTheme));
app.use(koaBodyParser());

export default app;
