import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';

const app = new Koa();

export const updateCharacteristics = async (ctx) => {
    const requestedNewCharacteristics = ctx.request.body;
    const characteristics = await ctx.publishedCharacteristic.findLastVersion();

    const newCharacteristics = Object
        .keys(characteristics)
        .filter(key => key !== 'publicationDate')
        .reduce((result, name) => {
            const newCharacteristic = requestedNewCharacteristics[name];

            return {
                ...result,
                [name]: newCharacteristic || characteristics[name],
            };
        }, {});

    ctx.body = await ctx.publishedCharacteristic.addNewVersion(newCharacteristics);
};

app.use(koaBodyParser());
app.use(route.put('/', updateCharacteristics));

export default app;
