import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';

import { COVER_COLLECTION } from '../../../common/cover';

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

const createDefaultField = label => ({
    cover: COVER_COLLECTION,
    label,
    name: 'new',
    display_in_list: true,
    display_in_resource: true,
    searchable: true,
    transformers: label ? [{
        operation: 'COLUMN',
        args: [{
            name: 'column',
            type: 'column',
            value: label,
        }],
    }] : [],
    classes: [],
    overview: 0,
});

export const createCharacteristic = async (ctx) => {
    const { value, ...fieldData } = ctx.request.body;

    const defaultField = createDefaultField(fieldData.label);

    const field = await ctx.field.create({
        ...defaultField,
        ...fieldData,
        display_in_resource: true,
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
