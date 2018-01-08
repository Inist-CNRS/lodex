import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import get from 'lodash.get';
import set from 'lodash.set';

import { COVER_DATASET } from '../../../common/cover';

const app = new Koa();

export const updateCharacteristics = async ctx => {
    const {
        name,
        publicationDate,
        ...requestedNewCharacteristics
    } = ctx.request.body;

    ctx.body = {};
    if (name) {
        const field = await ctx.field.findOneByName(name);
        if (get(field, 'transformers[0].operation') === 'VALUE') {
            const updatedField = set(
                field,
                'transformers[0].args[0].value',
                requestedNewCharacteristics[name],
            );
            ctx.body.field = await ctx.field.updateOneById(
                field._id,
                updatedField,
            );
        }
    }
    const characteristics = await ctx.publishedCharacteristic.findLastVersion();

    const newCharacteristics = Object.keys(characteristics).reduce(
        (result, name) => {
            const newCharacteristic = requestedNewCharacteristics[name];

            return {
                ...result,
                [name]: newCharacteristic || characteristics[name],
            };
        },
        {},
    );

    ctx.body.characteristics = await ctx.publishedCharacteristic.addNewVersion(
        newCharacteristics,
    );
};

export const createCharacteristic = async ctx => {
    const { value, ...fieldData } = ctx.request.body;

    const field = await ctx.field.create({
        ...fieldData,
        cover: COVER_DATASET,
        transformers: [
            {
                operation: 'VALUE',
                args: [
                    {
                        name: 'value',
                        type: 'string',
                        value,
                    },
                ],
            },
        ],
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
