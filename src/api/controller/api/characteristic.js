import Koa from 'koa';
import route from 'koa-route';

const app = new Koa();

export const updateCharacteristics = async (ctx) => {
    const characteristics = ctx.request.body;
    const newCharacteristics = await Promise.all(characteristics.map(({
        _id,
        value,
    }) => ctx.publishedCharacteristic.updateValueById(_id, value)));

    ctx.body = newCharacteristics.map(r => r.value);
};

app.use(route.put('/', updateCharacteristics));

export default app;
