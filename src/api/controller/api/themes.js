import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import { getAvailableThemes } from '../../models/themes';

const setup = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
};

export const getThemes = async ctx => {
    ctx.body = getAvailableThemes();
};

const app = new Koa();

app.use(setup);
app.use(route.get('/', getThemes));
app.use(koaBodyParser());

export default app;
