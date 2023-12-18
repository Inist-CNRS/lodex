export default async ctx => {
    ctx.body = {
        displayDensity: ctx.configTenant.front.displayDensity,
    };
};
