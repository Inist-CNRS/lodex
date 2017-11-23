import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';

import { COVER_DATASET } from '../../../common/cover';

const app = new Koa();

export const updateCharacteristics = async ctx => {
    const requestedNewCharacteristics = ctx.request.body;
    const characteristics = await ctx.publishedCharacteristic.findLastVersion();

    const newCharacteristics = Object.keys(characteristics)
        .filter(key => key !== 'publicationDate')
        .reduce((result, name) => {
            const newCharacteristic = requestedNewCharacteristics[name];

            return {
                ...result,
                [name]: newCharacteristic || characteristics[name],
            };
        }, {});

    ctx.body = await ctx.publishedCharacteristic.addNewVersion(
        newCharacteristics,
    );
};

export const createCharacteristic = async ctx => {
    const { value, ...fieldData } = ctx.request.body;

    const field = await ctx.field.create({
        ...fieldData,
        cover: COVER_DATASET,
    });

    const prevCharacteristics = await ctx.publishedCharacteristic.findLastVersion();
    const characteristics = await ctx.publishedCharacteristic.addNewVersion({
        ...prevCharacteristics,
        [field.name]: value,
    });

    ctx.body = {
        field,
        characteristics,
    };
};

app.use(koaBodyParser());
app.use(route.put('/', updateCharacteristics));
app.use(route.post('/', createCharacteristic));

export default app;
