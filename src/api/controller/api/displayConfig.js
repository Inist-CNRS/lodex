export default async ctx => {
    ctx.body = {
        displayDensity: ctx.currentConfig.front.displayDensity,
    };
};
