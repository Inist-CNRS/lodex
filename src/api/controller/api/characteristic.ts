import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import get from 'lodash/get';
import set from 'lodash/set';
import deepCopy from 'lodash/cloneDeep';

const app = new Koa();

const isCompositeField = (field: any) =>
    field.composedOf &&
    field.composedOf.isComposedOf &&
    field.composedOf.fields.length > 0;

const isValueField = (field: any) =>
    get(field, 'transformers[0].operation') === 'VALUE';

const updateFieldValue = async (ctx: any, field: any, value: any) => {
    if (get(field, 'transformers[0].args[0].value') === value) {
        return field;
    }

    // lodash.set mutate the object, so we need to copy the object first
    const copiedField = deepCopy(field);
    return ctx.field.updateOneById(
        field._id,
        set(copiedField, 'transformers[0].args[0].value', value),
    );
};

const updateField =
    (ctx: any, requestedNewCharacteristics: any) => async (field: any) => {
        const body = {};

        if (isValueField(field)) {
            const newValue = requestedNewCharacteristics[field.name] || null;
            // @ts-expect-error TS(2339): Property 'field' does not exist on type '{}'.
            body.field = await updateFieldValue(ctx, field, newValue);

            const annotation = await ctx.field.findOne({
                completes: field.name,
            });

            if (annotation) {
                await updateField(ctx, requestedNewCharacteristics)(annotation);
            }
        }

        if (isCompositeField(field)) {
            const composedFields = Object.values(
                await ctx.field.findByNames(field.composedOf.fields),
            );

            await Promise.all(
                composedFields.map(
                    updateField(ctx, requestedNewCharacteristics),
                ),
            );
        }

        return body;
    };

const prepareNewCharacteristics = (
    characteristics: any,
    newCharacteristics: any,
) => {
    const characteristicsNames = Object.keys(characteristics);
    const newCharacteristicsNames = Object.keys(newCharacteristics);

    const existingNewCharacteristicsNames = newCharacteristicsNames.filter(
        (newCharacteristicName: any) =>
            characteristicsNames.some(
                (characteristicName: any) =>
                    characteristicName === newCharacteristicName,
            ),
    );

    return existingNewCharacteristicsNames.reduce((result: any, name: any) => {
        const newValue = newCharacteristics[name] || null;
        return {
            ...result,
            [name]: newValue,
        };
    }, {});
};

export const updateCharacteristics = async (ctx: any) => {
    const { name, publicationDate, ...requestedNewCharacteristics } =
        ctx.request.body;

    ctx.body = {};

    if (name) {
        const field = await ctx.field.findOneByName(name);

        ctx.body = await updateField(ctx, requestedNewCharacteristics)(field);
    }

    const characteristics = await ctx.publishedCharacteristic.findLastVersion();
    const newCharacteristics = prepareNewCharacteristics(
        characteristics,
        requestedNewCharacteristics,
    );

    ctx.body.characteristics = await ctx.publishedCharacteristic.addNewVersion({
        ...characteristics,
        ...newCharacteristics,
    });
};

export const createCharacteristic = async (ctx: any) => {
    const { value, ...fieldData } = ctx.request.body;

    const highestPosition = await ctx.field.getHighestPosition();

    const field = await ctx.field.create({
        ...fieldData,
        position: highestPosition + 1,
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

    const prevCharacteristics =
        await ctx.publishedCharacteristic.findLastVersion();
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
