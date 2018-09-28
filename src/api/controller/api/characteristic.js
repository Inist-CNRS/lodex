import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import get from 'lodash.get';
import set from 'lodash.set';

import { COVER_DATASET } from '../../../common/cover';

const app = new Koa();

const isCompositeField = field =>
    field.composedOf &&
    field.composedOf.isComposedOf &&
    field.composedOf.fields.length > 0;

const isValueField = field =>
    get(field, 'transformers[0].operation') === 'VALUE';

const updateFieldValue = async (ctx, field, value) => {
    return await ctx.field.updateOneById(
        field._id,
        set(field, 'transformers[0].args[0].value', value),
    );
};

export const updateCharacteristics = async ctx => {
    const {
        name,
        publicationDate,
        ...requestedNewCharacteristics
    } = ctx.request.body;

    ctx.body = {};

    if (name) {
        const field = await ctx.field.findOneByName(name);

        if (isValueField(field)) {
            ctx.body.field = await updateFieldValue(
                ctx,
                field,
                requestedNewCharacteristics[field.name],
            );
        }

        if (isCompositeField(field)) {
            const composedFields = await Promise.all(
                field.composedOf.fields.map(ctx.field.findOneByName),
            );

            await Promise.all(
                composedFields.map(async composedField => {
                    if (isValueField(composedField)) {
                        await updateFieldValue(
                            ctx,
                            composedField,
                            requestedNewCharacteristics[composedField.name],
                        );
                    }
                }),
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

    const highestPosition = await ctx.field.getHighestPosition();

    const field = await ctx.field.create({
        ...fieldData,
        position: highestPosition + 1,
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
