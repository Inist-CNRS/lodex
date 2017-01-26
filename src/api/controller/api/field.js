export const getAllField = async (ctx) => {
    ctx.body = await ctx.field.findAll();
};

export const saveField = async (ctx, name) => {
    const newField = ctx.request.body;

    this.body = await ctx.field.upsertOneByName(name, newField);
};

export const removeField = async (ctx, name) => {
    this.body = await ctx.field.removeByName(name);
};
