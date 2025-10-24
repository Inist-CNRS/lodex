export default async (ctx: any) => {
    ctx.body = {
        displayDensity: ctx.configTenant.front.displayDensity,
    };
};
