import { validateField } from '../../models/field';

export const getAllField = async (ctx) => {
    ctx.body = await ctx.field.findAll();
};

export const postField = async (ctx) => {
    const newField = validateField(ctx.request.body);

    this.body = await ctx.field.insertOne(name, newField);
};

export const putField = async (ctx, name) => {
    const newField = validateField(ctx.request.body);

    this.body = await ctx.field.updateOneByName(name, newField);
};

export const removeField = async (ctx, name) => {
    this.body = await ctx.field.removeByName(name);
};
